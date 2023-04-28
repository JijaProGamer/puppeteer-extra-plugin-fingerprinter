Please read the puppeteer-extra-plugin-stealth page first (https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth) since my evasions are based on it.

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
})

// You can save staticFingerprint for later use if you want

let fingerprinter = createFingerprinterInterface({
    generator_style: "per_browser" || "global", // Optional if staticFingerprint is provided
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
    },

    staticFingerprint: staticFingerprint// Will only use this fingerprint for all pages and browsers if provided,
})

puppeteer.use(fingerprinter)
```

commonFingerprint is the most common fingerprint.