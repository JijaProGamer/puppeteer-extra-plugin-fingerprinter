import axios from 'axios';
import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
let memories = [4, 8, 16, 24, 32, 48, 64, 96, 128, 192, 256]
let canvases = [
    {shift: 1, chance: 50},
    {shift: 2, chance: 25},
    {shift: 4, chance: 75},
    {shift: 2, chance: 100},
    {shift: 3, chance: 35},
    {shift: 4, chance: 45},
    {shift: 5, chance: 95},
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

function generateFingerprint(generator_options = {
    webgl_vendor: (e) => e.includes("Google Inc."),
    webgl_renderer: (e) => e.includes("640"),
    leanguage: (e) => e.includes("en"),
    userAgent: (e) => e.includes("Windows"),
    language: (e) => e.includes("en"),
    viewport: (e) => e.width > 1000 && e.height > 800,
    cpus: (e) => e <= 16 && e >= 4,
    memory: (e) => e <= 32 && e >= 4,
    compatibleMediaMimes: (e) => e.audio.includes("aac") && e.video["mp4"] && e.video.mp4.length > 0,
    canvas: (e) => e.chance < 75 && e.chance > 20
}) {
    let webgl_vendor = webgl_vendors.find(generator_options.webgl_vendor) || commonFingerprint.webgl_vendor
    let webgl_renderer = webgl_renderers[webgl_vendor].find(generator_options.webgl_renderer) || commonFingerprint.webgl_renderer
    let viewport = viewports.find(generator_options.viewport) || commonFingerprint.viewport
    let cpu = cpus.find(generator_options.cpus) || commonFingerprint.cpus
    let memory = memories.find(generator_options.memory) || commonFingerprint.memory
    let compatibleMediaMimes = mediaTypes.find(generator_options.compatibleMediaMimes) || commonFingerprint.compatibleMediaMimes
    let userAgent = userAgents.find(generator_options.userAgent) || commonFingerprint.userAgent
    let language = languages.find(generator_options.language) || commonFingerprint.language
    let canvas = canvases.find(generator_options.canvas) || commonFingerprint.canvas

    return {
        compatibleMediaMimes,
        language,
        webgl_vendor,
        webgl_renderer,
        viewport,
        userAgent,
        memory,
        canvas,
        cpu,
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
            'sourceurl',
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
            //[...this.opts.enabledEvasions].map(e => `${this.name}/evasions/${e}`)
            [...this.opts.enabledEvasions].map(e => __dirname + `/evasions/${e}`)
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

    async onPageCreated() {
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