//import axios from 'axios';
import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin';

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

let webgl_vendors = ["Google Inc.", "NVIDIA Corporation"]
let webgl_renderers = {
    "Google Inc.": [
        "ANGLE (Intel(R) HD Graphics 520 Direct3D11 vs_5_0 ps_5_0)",
        "ANGLE (Intel(R) HD Graphics 530 Direct3D11 vs_5_0 ps_5_0)",
        "ANGLE (Intel(R) HD Graphics 510 Direct3D11 vs_5_0 ps_5_0)",

        "ANGLE (Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)",
        "ANGLE (Intel(R) UHD Graphics 640 Direct3D11 vs_5_0 ps_5_0)",

        "ANGLE (Intel(R) UHD Graphics 740 Direct3D11 vs_5_0 ps_5_0)",
        "ANGLE (Intel(R) UHD Graphics 750 Direct3D11 vs_5_0 ps_5_0)",
    ],
    "NVIDIA Corporation": [
        "NVIDIA GeForce RTX 3080/PCIe/SSE2",
        "NVIDIA GeForce RTX 3070/PCIe/SSE2",
        "NVIDIA GeForce RTX 3060/PCIe/SSE2",

        "NVIDIA GeForce RTX 4090/PCIe/SSE2",
        "NVIDIA GeForce RTX 3080/PCIe/SSE2",
        "NVIDIA GeForce RTX 3070/PCIe/SSE2",
        "NVIDIA GeForce RTX 3060/PCIe/SSE2",

        "NVIDIA GeForce RTX 2080/PCIe/SSE2",
        "NVIDIA GeForce RTX 2070/PCIe/SSE2",
        "NVIDIA GeForce RTX 2060/PCIe/SSE2",
        "NVIDIA GeForce RTX 2050/PCIe/SSE2",

        "NVIDIA GeForce GTX 1660/PCIe/SSE2",
        "NVIDIA GeForce GTX 1650/PCIe/SSE2",

        "NVIDIA GeForce GTX 1080/PCIe/SSE2",
        "NVIDIA GeForce GTX 1070/PCIe/SSE2",
        "NVIDIA GeForce GTX 1060/PCIe/SSE2",
        "NVIDIA GeForce GTX 1050/PCIe/SSE2",

        "NVIDIA GeForce GTX 950/PCIe/SSE2",
        "NVIDIA GeForce GTX 960/PCIe/SSE2",
        "NVIDIA GeForce GTX 970/PCIe/SSE2",
        "NVIDIA GeForce GTX 980/PCIe/SSE2",

        "NVIDIA GeForce GTX 750/PCIe/SSE2",
        "NVIDIA GeForce GTX 760/PCIe/SSE2",
        "NVIDIA GeForce GTX 770/PCIe/SSE2",
        "NVIDIA GeForce GTX 780/PCIe/SSE2",

        "NVIDIA GeForce GTX 680/PCIe/SSE2",
        "NVIDIA GeForce GTX 670/PCIe/SSE2",
        "NVIDIA GeForce GTX 660/PCIe/SSE2",
        "NVIDIA GeForce GTX 650/PCIe/SSE2",

        "NVIDIA GeForce GTX 580/PCIe/SSE2",
        "NVIDIA GeForce GTX 570/PCIe/SSE2",
        "NVIDIA GeForce GTX 560/PCIe/SSE2",
        "NVIDIA GeForce GTX 550/PCIe/SSE2",
    ]
}
let languages = [
    "en-US,en",
    "ab-AB,ab",
    "af-AF,af",
    "ro-RO,ro",
    "br-BR,br",
    "nl-NL,nl",
    "he-HE,he",
    "ja-JA,ja",
]
let cpus = [4, 8, 12, 16, 24, 32, 64, 96]
let memories = [0.25, 0.5, 1, 2, 4, 8]
let canvases = [
    { shift: 1, chance: 50 },
    { shift: 2, chance: 25 },
    { shift: 4, chance: 75 },
    { shift: 2, chance: 100 },
    { shift: 3, chance: 35 },
    { shift: 4, chance: 45 },
    { shift: 5, chance: 95 },
]
let userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 OPR/94.0.0.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.70",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.55",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
]
let viewports = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1536, height: 864 },
    { width: 2160, height: 1440 },
    { width: 4096, height: 2160 },
    { width: 2560, height: 1080 },
    { width: 5120, height: 2160 },
    { width: 1920, height: 800 },
]

let mediaTypes = [
    {
        audio: [`flac`, `vorbis`, `opus`, 'aac'],
        video: {
            mp4: [`avc1.42E01E`, `H264`, `flac`],
            mpeg: [],
            ogg: ["opus", "theora"],
            webm: ["vp9", "vp8"]
        }
    },
    {
        audio: [`flac`, `opus`],
        video: {
            mp4: [`avc1.42E01E`, `H264`, `flac`],
            webm: ["vp8"]
        }
    },
    {
        audio: [`vorbis`, `opus`, 'aac'],
        video: {
            mp4: [`avc1.42E01E`, `H264`, `flac`],
            mpeg: [],
            ogg: ["opus"],
        }
    },
    {
        audio: [`flac`, `vorbis`, 'aac'],
        video: {
            mp4: [`avc1.42E01E`, `H264`, `flac`],
            ogg: ["opus", "theora"],
            webm: ["vp8"]
        }
    },
]

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

    /*console.log({
        compatibleMediaMimes,
        language,
        webgl_vendor,
        webgl_renderer,
        viewport,
        userAgent,
        memory,
        canvas,
        cpus: cpu,
    })*/

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
    }
}

let globalFingerprint

class FingerprinterPlugin extends PuppeteerExtraPlugin {
    constructor(opts = {}) {
        super(opts)
    }

    get name() {
        return 'fingerprinter'
    }

    get defaults() {
        const availableEvasions = new Set([
            'chrome.app',
            'chrome.csi',
            'chrome.loadTimes',
            'chrome.runtime',
            'defaultArgs',
            'media.codecs',
            'navigator.hardware',
            'navigator.languages',
            'navigator.permissions',
            'navigator.plugins',
            'navigator.webdriver',
            'navigator.vendor',
            'document.focus',
            //'sourceurl',
            'webgl.vendor',
            'window.outerdimensions',
            'window.dimensions',
            'user-agent',
        ])
        return {
            availableEvasions,
            enabledEvasions: new Set([...availableEvasions])
        }
    }

    get dependencies() {
        return new Set(
            [...this.opts.enabledEvasions].map(e => `${this.name}/evasions/${e}`)
            //[...this.opts.enabledEvasions].map(e => __dirname + `/evasions/${e}`)
        )
    }

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
        if (this.opts.generator_style == "per_page" && !this.opts.staticFingerprint) {

        }
    }

    async beforeLaunch(options) {
        if (this.opts.staticFingerprint) {
            options.opts = this.opts.staticFingerprint
        } else {
            switch (this.opts.generator_style) {
                case "global":
                    if (!globalFingerprint) {
                        globalFingerprint = generateFingerprint(this.opts.fingerprint_generator)
                    }

                    options.opts = globalFingerprint
                    break;
                case "per_browser":
                    options.opts = generateFingerprint(this.opts.fingerprint_generator)
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