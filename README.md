NOTE: This does not fix the issues with headless: true!!! If you want to use a headless mode use headless: "new" or other ways

# Constructor

```js
import { createFingerprinterInterface, commonFingerprint, generateFingerprint } from "./index.js"
import { default as puppeteer } from "puppeteer-extra"

let staticFingerprint = generateFingerprint({
    webgl_vendor: "NVIDIA Corporation", // You can use values instead of functions too
    webgl_renderer: "NVIDIA GeForce GTX 1650/PCIe/SSE2",
    userAgent: (e) => {return e.includes("Windows NT 10.0")},
    language: (e) => {return e.includes("en")},
    viewport: (e) => {return e.width > 1000 && e.height > 800},
    language: (e) => true,
    cpus: (e) => {return e <= 32 && e >= 4},
    memory: (e) => {return e <= 8},
    compatibleMediaMimes: (e) => {return e.audio.includes("aac"), e.video["mp4"] && e.video.mp4.length > 0},
    canvas: {chance: 95, shift: 4}, // set shift to 0 to cancel canvas spoofing
    proxy: "direct", // Support for string only
    proxy: () => "direct", // Defaults to this, meaning no proxy
    proxy: () =>  ["direct", "socks5://127.0.0.1"], // Support for array and get a random object
    requestInterceptPriorty: 0 // Support for puppeteers cooperative-intercept-mode
})

// You can save staticFingerprint for later use if you want

let fingerprinter = createFingerprinterInterface({
    generator_style: "per_browser" || "global" || "per_page", // Optional if staticFingerprint is provided
    requestInterceptor: async (page, request) => { // Ability to intercept requests, fixes puppeteer request interception bugs
        if(await request.url() == "www.example.com/page4" && await page.url() == "www.example.com") 
            return "direct"

        if(await request.url() == "www.example.com/big_image")
            return "abort"

        return "proxy"
    },

    fingerprint_generator: {
        webgl_vendor: "NVIDIA Corporation", // You can use values instead of functions too
        webgl_renderer: "NVIDIA GeForce GTX 1650/PCIe/SSE2",
        userAgent: (e) => {return e.includes("Windows NT 10.0")},
        language: (e) => {return e.includes("en")},
        viewport: (e) => {return e.width > 1000 && e.height > 800},
        language: (e) => true,
        cpus: (e) => {return e <= 32 && e >= 4},
        memory: (e) => {return e <= 8},
        compatibleMediaMimes: (e) => {return e.audio.includes("aac"), e.video["mp4"] && e.video.mp4.length > 0},
        canvas: {chance: 95, shift: 4}, // set shift to 0 to cancel canvas spoofing
        proxy: "direct", // Support for string only
        proxy: () => "direct", // Defaults to this, meaning no proxy
        proxy: () =>  ["direct", "socks5://127.0.0.1"] // Support for array and get a random object
        requestInterceptPriorty: 0 // Support for puppeteers cooperative-intercept-mode
    },

    staticFingerprint: staticFingerprint// Will only use this fingerprint for all pages and browsers if provided,
})

puppeteer.use(fingerprinter)
```

commonFingerprint is the most common fingerprint.