import { createFingerprinterInterface } from "./index.js";
import puppeteer from "puppeteer-extra"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

global.dev = true

let fingerprintInterface = createFingerprinterInterface({generator_style: "per_page"})

puppeteer.use(fingerprintInterface)

puppeteer.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
}).then(async (browser) => {
    let page = await browser.newPage()
    //await page.goto("https://amiunique.org/fp")
    await page.goto("https://fingerprint.com/products/bot-detection", {waitUntil: "networkidle0"})
    //await page.goto("https://abrahamjuliot.github.io/creepjs/", {waitUntil: "networkidle2"})
    await sleep(3000)

    await page.screenshot({path: "image.png", fullPage: true})

    console.log("Done")
})