import { createFingerprinterInterface, generateFingerprint } from "./index.js";
import puppeteer from "puppeteer-extra"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let staticFingerprint = generateFingerprint({
    webgl_vendor: "NVIDIA Corporation",
    webgl_renderer: () => true,
    userAgent: (e) => {return e.includes("Windows NT 10.0")},
    language: (e) => {return e.includes("en")},
    viewport: (e) => {return e.width > 1000 && e.height > 800},
    cpus: (e) => {return e <= 32 && e >= 4},
    memory: (e) => {return e <= 8},
    compatibleMediaMimes: (e) => {return e.audio.includes("aac"), e.video["mp4"] && e.video.mp4.length > 0},
    canvas: {chance: 95, shift: 4}, 
    //proxy: () => "test" // Test is not a valid proxy so it should error
})

let fingerprintInterface = createFingerprinterInterface({
    generator_style: "per_page",
    //staticFingerprint: staticFingerprint,
    requestInterceptor: (page, request) => {
        /*abort()
        useProxy()*/

        return "direct"
    }
})

puppeteer.use(fingerprintInterface)

/*puppeteer.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
}).then(async (browser) => {
    let page = await browser.newPage()
    //await page.goto("https://amiunique.org/fp")
    await page.goto("https://fingerprint.com/products/bot-detection", {waitUntil: "networkidle0"})
    //await page.goto("https://abrahamjuliot.github.io/creepjs/", {waitUntil: "networkidle2"})
    await sleep(3000)

    //await page.screenshot({path: "image.png", fullPage: true})

    console.log("Done")
})*/

puppeteer.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
}).then(async (browser) => {
    let page = await browser.newPage()
    await page.goto("https://www.youtube.com/watch?v=EMLwtpuccLM")
})

puppeteer.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
}).then(async (browser) => {
    let page = await browser.newPage()
    await page.goto("https://www.youtube.com/watch?v=EMLwtpuccLM")
})

puppeteer.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
}).then(async (browser) => {
    let page = await browser.newPage()
    await page.goto("https://www.youtube.com/watch?v=EMLwtpuccLM")
})