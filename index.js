//import axios from 'axios';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin';
import useProxy from 'puppeteer-page-proxy'

import { dirname } from 'path'
import { createRequire } from 'module';
import { fileURLToPath } from 'url'

global.require = createRequire(fileURLToPath(import.meta.url)); 
global.__dirname = dirname(fileURLToPath(import.meta.url))

let commonFingerprint = {
    webgl_vendor: "NVIDIA Corporation",
    webgl_renderer: "NVIDIA GeForce GTX 1650/PCIe/SSE2",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",

    language: "en-US,en",
    viewport: {
        width: 1920,
        height: 1080,
    },
    canvas: {
        shift: 1,
        chance: 50,
    },

    cpus: 4,
    memory: 8,

    compatibleMediaMimes: {
        audio: [`flac`, `vorbis`, `opus`, 'aac'],
        video: {
            mp4: [`avc1.42E01E`, `H264`, `flac`],
            mpeg: [],
            ogg: ["opus", "theora"],
            webm: ["vp9", "vp8"]
        }
    }
}

let cpus = [4, 8, 12, 16, 24, 32, 64, 96]
let memories = [0.25, 0.5, 1, 2, 4, 8]
let webgl_vendors = ["Google Inc.", "NVIDIA Corporation"]
let webgl_renderers = JSON.parse(readFileSync(path.join(__dirname, "/databases/webgl_renderers.json")))
let mediaTypes = JSON.parse(readFileSync(path.join(__dirname, "/databases/media_types.json")))
let languages = JSON.parse(readFileSync(path.join(__dirname, "/databases/languages.json")))
let canvases = JSON.parse(readFileSync(path.join(__dirname, "/databases/canvases.json")))
let userAgents = JSON.parse(readFileSync(path.join(__dirname, "/databases/userAgents.json")))
let viewports = JSON.parse(readFileSync(path.join(__dirname, "/databases/viewports.json")))

function shuffle(arr) {
    return [...arr]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

function generateFingerprint(generator_options = {}) {
    generator_options = {
        webgl_vendor: (e) => true,
        webgl_renderer: (e) => true,
        language: (e) => e.includes("en"),
        userAgent: (e) => e.includes("Windows"),
        viewport: (e) => e.width > 1000 && e.height > 800 && e.width < 2000 && e.height < 2000,
        cpus: (e) => e <= 24 && e >= 4,
        memory: (e) => true,
        compatibleMediaMimes: (e) => e.audio.includes("aac") && e.video["mp4"] && e.video.mp4.length > 0,
        canvas: (e) => true,
        proxy: (e) => ["direct://"],
        ...generator_options,
    }

    let webgl_vendor = generator_options.webgl_vendor
    let webgl_renderer = generator_options.webgl_renderer
    let viewport = generator_options.viewport
    let cpu = generator_options.cpus
    let memory = generator_options.memory
    let compatibleMediaMimes = generator_options.compatibleMediaMimes
    let canvas = generator_options.canvas
    let language = generator_options.language
    let userAgent = generator_options.userAgent
    let proxy = generator_options.proxy

    let shuffled_webgl_vendors = shuffle(webgl_vendors)
    let shuffled_viewports = shuffle(viewports)
    let shuffled_cpus = shuffle(cpus)
    let shuffled_memories = shuffle(memories)
    let shuffled_mediaTypes = shuffle(mediaTypes)
    let shuffled_canvases = shuffle(canvases)
    let shuffled_userAgents = shuffle(userAgents)
    let shuffled_languages = shuffle(languages)

    if (typeof generator_options.webgl_vendor == "function")
        webgl_vendor = shuffled_webgl_vendors.find(generator_options.webgl_vendor) || commonFingerprint.webgl_vendor

    if (typeof generator_options.webgl_renderer == "function")
        webgl_renderer = shuffle(webgl_renderers[webgl_vendor] || []).find(generator_options.webgl_renderer) || commonFingerprint.webgl_renderer

    if (typeof generator_options.viewport == "function")
        viewport = shuffled_viewports.find(generator_options.viewport) || commonFingerprint.viewport

    if (typeof generator_options.cpus == "function")
        cpu = shuffled_cpus.find(generator_options.cpus) || commonFingerprint.cpus

    if (typeof generator_options.memory == "function")
        memory = shuffled_memories.find(generator_options.memory) || commonFingerprint.memory

    if (typeof generator_options.compatibleMediaMimes == "function")
        compatibleMediaMimes = shuffled_mediaTypes.find(generator_options.compatibleMediaMimes) || commonFingerprint.compatibleMediaMimes

    if (typeof generator_options.canvas == "function")
        canvas = shuffled_canvases.find(generator_options.canvas) || commonFingerprint.canvas

    if (typeof generator_options.userAgent == "function")
        userAgent = shuffled_userAgents.find(generator_options.userAgent) || commonFingerprint.userAgent

    if (typeof generator_options.language == "function")
        language = shuffled_languages.find(generator_options.language) || commonFingerprint.language

    if (typeof generator_options.proxy == "function"){
        let proxies = generator_options.proxy()

        if(typeof proxies == "string") {
            proxy = proxies
        } else {
            proxy = shuffle(proxies)[Math.floor(Math.random() * proxies.length)]
        }
    }

    return {
        compatibleMediaMimes,
        language,
        webgl_vendor,
        webgl_renderer,
        viewport,
        userAgent,
        memory,
        canvas,
        cpus: cpu,
        proxy,
    }
}

let globalFingerprint

let evasions = [
    "useragent",
    "webdriver",
    "chrome.runtime",
    "document.focus",
    "media.codecs",
    "navigator.hardware",
    "navigator.language",
    "navigator.permissions",
    "webgl", // Add pixel switching after fixing canvas
    "canvas", // Fix canvas -___- I have canvas
    "window.dimensions"
]

// To see later:
// Date.toString() on normal chrome: 'function Date() { [native code] }'
// Date.toString on normal chrome: ƒ toString() { [native code] }
// Date.toString() on puppeteer: 'function Date() { [native code] }'
// Date.toString on puppeteer: Proxy(Function) {length: 0, name: 'toString'}

let evasionPlugins = {}
let badDefaultArgs = [
    '--disable-extensions',
    '--disable-default-apps',
    '--enable-automation',
    '--disable-component-extensions-with-background-pages'
]

for(let evasion of evasions){
    evasionPlugins[evasion] = require(path.join(__dirname, "evasions", `${evasion}.cjs`))
}

class FingerprinterPlugin extends PuppeteerExtraPlugin {
    constructor(opts = {}) {
        super(opts)
    }

    get name() {
        return 'fingerprinter'
    }

    get defaults() {
        return {
            availableEvasions: new Set(evasions),
            enabledEvasions: new Set([...evasions])
        }
    }

    get dependencies() {return []}

    get availableEvasions() {
        return this.defaults.availableEvasions
    }

    get enabledEvasions() {
        return this.opts.enabledEvasions
    }

    set enabledEvasions(evasions) {
        this.opts.enabledEvasions = evasions
    }

    async onPageCreated(page) {
        let options = page.browser().__fingerprinter_options
        if(!options) options = generateFingerprint(this.opts.fingerprint_generator)
        page.options = options

        await page.setRequestInterception(true);
        const INTERCEPT_PRIORITY = this.opts.fingerprint_generator.requestInterceptPriorty || 0

        for(let evasion of this.availableEvasions){
            evasionPlugins[evasion](page, page.options)
        }

        page.on('request', async (request) => {
            if (request.isInterceptResolutionHandled()) return;

            let headers = {...{
                //"accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.5',
                //'upgrade-insecure-requests': '1',
            },...request.headers()}

            if (request.isNavigationRequest()) {
                headers["sec-fetch-mode"] = "navigate";
                headers["sec-fetch-site"] = "none";
                headers["sec-fetch-user"] = "?1";
            } else {
                headers["sec-fetch-mode"] = "no-cors";
                headers["sec-fetch-site"] = "same-origin";
            }

            let resourceType = request.resourceType()

            if(!resourceType == "ping"){
                if(resourceType == "fetch"){
                    headers["sec-fetch-dest"] = "empty"
                } else {
                    headers["sec-fetch-dest"] = resourceType
                }
            }

            // Wait for other request handlers to do their jobs, usefull for not wasting bandwidth on rejections and such
            
            if(typeof this.opts.requestInterceptor == "function"){
                try {
                    let mode = await this.opts.requestInterceptor(page, request)
                    if(request.isInterceptResolutionHandled()) throw new Error("Request is already handled!")
    
                    if(mode == "proxy" && (page.options.proxy == "direct" || page.options.proxy == "direct://"))
                            mode = "direct"
    
                    switch(mode){
                        case "direct":
                            request.continue({headers}, INTERCEPT_PRIORITY)
                            break
                        case "proxy":
                            useProxy(request, {proxy: page.options.proxy, headers})
                            break
                        case "abort":
                            request.abort('aborted', INTERCEPT_PRIORITY)
                            break
                    }
                } catch(err) {
                    console.error(err)
                }
            } else {
                if (request.isInterceptResolutionHandled()) return;
                let proxy = (page.options.proxy || "").trim()

                if(!proxy || proxy == "direct" || proxy == "direct://"){
                    request.continue({headers}, INTERCEPT_PRIORITY)
                } else {
                    useProxy(request, {proxy, headers})
                }
            }
        });
      }

    async onBrowser(browser, opts){
        browser.__fingerprinter_options = (opts.fingerprint_opts || opts.options.fingerprint_opts);
    }

    async beforeLaunch(options) {            
        options.ignoreDefaultArgs = options.ignoreDefaultArgs || []
        if (options.ignoreDefaultArgs !== true) {
            for(let arg of badDefaultArgs){
                if(!options.ignoreDefaultArgs.includes(arg)){
                    options.ignoreDefaultArgs.push(arg)
                }
            }
        }

        if (this.opts.staticFingerprint) {
            options.fingerprint_opts = this.opts.staticFingerprint
            return
        } else {
            if(!this.opts.generator_style){
                options.fingerprint_opts = generateFingerprint(this.opts.fingerprint_generator)
                return
            }

            switch (this.opts.generator_style) {
                case "global":
                    if (!globalFingerprint) {
                        globalFingerprint = generateFingerprint(this.opts.fingerprint_generator)
                    }

                    options.fingerprint_opts = globalFingerprint
                    break;
                case "per_browser":
                    options.fingerprint_opts = generateFingerprint(this.opts.fingerprint_generator)
                    break;
            }
        }
    }
}

function createFingerprinterInterface(options) {
    return new FingerprinterPlugin(options)
}

createFingerprinterInterface.FingerprinterPlugin = FingerprinterPlugin;
createFingerprinterInterface.default = createFingerprinterInterface;

export { createFingerprinterInterface, commonFingerprint, generateFingerprint }
export default createFingerprinterInterface