NOTE: This does not fix the issues with headless: true!!! If you want to use a headless mode use headless: "new" or other ways

# Constructor

```js
import { GetCommonFingerprint, GenerateFingerprint, ConnectFingerprinter } from "playwright-anti-fingerprinter"
import { firefox } from "playwright" // chromium and webkit supported too

let commonFingerprint = GetCommonFingerprint("firefox")

function requestInterceptor(page, requestData, route) {
    let request = route.request()

    if(request.resourceType() == "image"){
        return "abort"
    }

    if(requestData.url.includes("banana")){
        return "direct"
    }

    return "proxy"
};

let staticFingerprint = GenerateFingerprint({
    webgl_vendor: (e) => e.includes("Intel") || e.includes("AMD") || e.includes("NVIDIA"), 
    webgl_renderer: (e) => true,
    userAgent: (e) => {return e.includes("Windows NT 10.0")},
    language: (e) => {return e.includes("en")},
    viewport: (e) => {return e.width > 1000 && e.height > 800},
    language: (e) => true,
    cpus: (e) => {return e <= 32 && e >= 4},
    memory: (e) => {return e <= 8},
    compatibleMediaMimes: (e) => {return e.audio.includes("aac"), e.video["mp4"] && e.video.mp4.length > 0},
    proxy: "direct", // Support for string only
    proxy: () => "direct", // Defaults to this, meaning no proxy
})

// For custom caches please read https://github.com/JijaProGamer/Playwright-cache

let memoryCache = {};
// Please don't use this cache implementation if launching multiple browsers using this cache
// since it ignores "type", saving "private" in a public cache object

let cache = {
    save: (URL, type, expires, Data) => {
        return new Promise((resolve, reject) => {
            memoryCache[URL] = { expires, Data }
            resolve()
        })
    },
    read: (URL) => {
        return new Promise((resolve, reject) => {
            let CachedResponse = memoryCache[URL]
            
            if (!CachedResponse) {
                return resolve(false)
            }

            if (Date.now() >= CachedResponse.expires) {
                delete memoryCache[URL]
                return resolve(false)
            }

            resolve(CachedResponse.Data)
        })
    }
}

// You can save fingerprint for later use if you want

// Create browser, etc

await ConnectFingerprinter("firefox", page, {
    fingerprint: staticFingerprint, // if not provided, makes a new one
    requestInterceptor, // if no provided, will proxy everything
    cache // If not provided will use a default cache
})
```

commonFingerprint is the most common fingerprint.

Note! The "plugins" evasions is currently disabled, due to creating