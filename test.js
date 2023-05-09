import { createFingerprinterInterface } from "./index.js";
import puppeteer from "puppeteer-extra"

global.dev = true

let fingerprintInterface = createFingerprinterInterface({generator_style: "per_browser"})

puppeteer.use(fingerprintInterface)

puppeteer.launch({

}).then(async (browser) => {
    let page = await browser.newPage()
    await page.goto("https://www.whatismybrowser.com/detect/what-http-headers-is-my-browser-sending")
    await page.screenshot({path: "image.png", fullPage: true})

    console.log("Done")
})