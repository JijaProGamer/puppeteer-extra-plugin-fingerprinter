import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import got from "got";

import { dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { tmpdir } from "os"
import { randomUUID } from 'node:crypto';

import useProxy from './proxy/proxy.js';
import { CacheResponse, SearchCache } from 'playwright-cache';
import { firefox } from 'playwright';

import { SocksProxyAgent } from "socks-proxy-agent";
import { HttpProxyAgent } from "http-proxy-agent";
import { HttpsProxyAgent } from "https-proxy-agent";
import countryLocaleMap from 'country-locale-map';

import { loadFirefoxAddon } from './firefox_ext_installer.js';

let require = createRequire(fileURLToPath(import.meta.url));
let __dirname = dirname(fileURLToPath(import.meta.url))

let commonFingerprints = {}
let evasionPlugins = {}
let evasionExtensions = {}
let networkEvasionPlugins = {}
let databases = {}

let databaseTypes = [
    "webgl_renderers",
    "compatibleMediaMimes",
    "languages",
    "userAgents",
    //"canvass",
    "viewports"
]

let supportedDrivers = [
    "firefox",
    //"chromium"
]

for (let driver of supportedDrivers) {
    let evasionsPosible = JSON.parse(readFileSync(path.join(__dirname, "evasions", driver, "evasions.json")))
    evasionPlugins[driver] = {}
    evasionExtensions[driver] = {}
    networkEvasionPlugins[driver] = {}
    databases[driver] = {
        cpus: [4, 8, 12, 16, 24, 32, 64, 96],
        memories: [0.25, 0.5, 1, 2, 4, 8],
        webgl_vendors: Object.keys(JSON.parse(readFileSync(path.join(__dirname, "databases", driver, `webgl_renderers.json`))))
    }

    for (let evasion of evasionsPosible.evasions) {
        if (evasion.startsWith("network-")) {
            networkEvasionPlugins[driver][evasion] = require(path.join(__dirname, "evasions", driver, "evasions", `${evasion}.cjs`))
        } else {
            evasionPlugins[driver][evasion] = require(path.join(__dirname, "evasions", driver, "evasions", `${evasion}.cjs`))
        }
    }

    for (let evasion of evasionsPosible.plugins) {
        evasionExtensions[driver][evasion] = path.join(__dirname, "evasions", driver, "plugins", evasion)
    }

    for (let databaseType of databaseTypes) {
        databases[driver][databaseType] = JSON.parse(readFileSync(path.join(__dirname, "databases", driver, `${databaseType}.json`)))
    }

    commonFingerprints[driver] = JSON.parse(readFileSync(path.join(__dirname, "databases", "common", `${driver}.json`)))
}

function shuffle(arr) {
    return [...arr]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

const setAgent = (proxy) => {
    if (proxy.startsWith("socks")) {
        return {
            http: new SocksProxyAgent(proxy),
            https: new SocksProxyAgent(proxy)
        };
    }
    return {
        http: new HttpProxyAgent(proxy),
        https: new HttpsProxyAgent(proxy)
    };
};

function smootherstep(edge0, edge1, x) {
    x = Math.sqrt(x);  
    return edge0 + (edge1 - edge0) * x;
}

function GetCommonFingerprint(browserType) {
    if (!commonFingerprints[browserType]) {
        throw new Error(`browser type "${browserType}" is not supported. Please use ${supportedDrivers.join(" or ")}.`)
    }

    return commonFingerprints[browserType]
}

function GenerateFingerprint(browserType, generator_options = {}) {
    if (!databases[browserType]) {
        throw new Error(`browser type "${browserType}" is not supported. Please use ${supportedDrivers.join(" or ")}.`)
    }

    let database = databases[browserType]
    generator_options = {
        webgl_vendor: (e) => e.includes("Intel") || e.includes("AMD") || e.includes("NVIDIA"),
        webgl_renderer: (e) => true,
        language: (e) => e.includes("en") && e.length < 15,
        userAgent: (e) => e.includes("Windows"),
        viewport: (e) => e.width > 1000 && e.height > 800 && e.width < 2000 && e.height < 2000,
        cpu: (e) => e <= 24 && e >= 4,
        memory: (e) => true,
        compatibleMediaMime: (e) => e.audio.includes("aac") && e.video.includes("avc1"),
        canvas: (e) => true,
        proxy: (e) => "direct://",
        ...generator_options,
    }

    let fingerprint = {}

    fingerprint["webgl_vendor"] = typeof(generator_options["webgl_vendor"]) == "function" ? 
                shuffle(database["webgl_vendors"]).find(generator_options["webgl_vendor"]) : 
                typeof(generator_options["webgl_vendor"]) == "object" ? 
                generator_options["webgl_vendor"][Math.floor(Math.random() * generator_options["webgl_vendor"].length)] : generator_options["webgl_vendor"]

    fingerprint["webgl_renderer"] = typeof(generator_options["webgl_renderer"]) == "function" ? 
                shuffle(database["webgl_renderers"][fingerprint["webgl_vendor"]]).find(generator_options["webgl_renderer"]) : 
                typeof(generator_options["webgl_renderer"]) == "object" ? 
                generator_options["webgl_renderer"][Math.floor(Math.random() * generator_options["webgl_renderer"].length)] : generator_options["webgl_renderer"]

    fingerprint["userAgent"] = typeof(generator_options["userAgent"]) == "function" ? 
                shuffle(database["userAgents"]).find(generator_options["userAgent"]) : 
                typeof(generator_options["userAgent"]) == "object" ? 
                generator_options["userAgent"][Math.floor(Math.random() * generator_options["userAgent"].length)] : generator_options["userAgent"]

    fingerprint["viewport"] = typeof(generator_options["viewport"]) == "function" ? 
                shuffle(database["viewports"]).find(generator_options["viewport"]) : 
                typeof(generator_options["viewport"]) == "object" ? 
                generator_options["viewport"][Math.floor(Math.random() * generator_options["viewport"].length)] : generator_options["viewport"]

    fingerprint["cpu"] = typeof(generator_options["cpu"]) == "function" ? 
                shuffle(database["cpus"]).find(generator_options["cpu"]) : 
                typeof(generator_options["cpu"]) == "object" ? 
                generator_options["cpu"][Math.floor(Math.random() * generator_options["cpu"].length)] : generator_options["cpu"]

    fingerprint["memory"] = typeof(generator_options["memory"]) == "function" ? 
                shuffle(database["memories"]).find(generator_options["memory"]) : 
                typeof(generator_options["memory"]) == "object" ? 
                generator_options["memory"][Math.floor(Math.random() * generator_options["memory"].length)] : generator_options["memory"]

    fingerprint["compatibleMediaMime"] = typeof(generator_options["compatibleMediaMime"]) == "function" ? 
                shuffle(database["compatibleMediaMimes"]).find(generator_options["compatibleMediaMime"]) : 
                typeof(generator_options["compatibleMediaMime"]) == "object" ? 
                generator_options["compatibleMediaMime"][Math.floor(Math.random() * generator_options["compatibleMediaMime"].length)] : generator_options["compatibleMediaMime"]

    fingerprint["proxy"] = typeof(generator_options["proxy"]) == "function" ? 
                generator_options["proxy"]() : 
                typeof(generator_options["proxy"]) == "object" ? 
                generator_options["proxy"][Math.floor(Math.random() * generator_options["proxy"].length)] : generator_options["proxy"]

    return fingerprint
}

async function ConnectFingerprinter(browserType, page, options, blacklistedEvasions=[]) {
    let fingerprint = options.fingerprint
    if (!fingerprint) fingerprint = GenerateFingerprint(browserType);

    if (fingerprint.proxy == "direct" || fingerprint.proxy == "direct://") fingerprint.proxy = null

    if (!options.cache) {
        let memoryCache = {};

        options.cache = {
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
    }

    await page.route('**', async (route) => {
        try {
            if (await SearchCache(route, options.cache.read))
                return

            let request = route.request()

            let requestData = {
                method: request.method(),
                postData: request.postDataBuffer(),
                headers: await request.allHeaders(),
                url: request.url()
            }

            for (let plugin in networkEvasionPlugins[browserType]) {
                if (networkEvasionPlugins[browserType].hasOwnProperty(plugin)) {
                    if(blacklistedEvasions.includes(plugin)) continue;

                    requestData = await networkEvasionPlugins[browserType][plugin](route, requestData, fingerprint)
                }
            }

            if (typeof options.requestInterceptor == "function") {
                let mode = await options.requestInterceptor(page, requestData, route)

                if (mode == "proxy" && !fingerprint.proxy)
                    mode = "direct"

                switch (mode) {
                    case "direct":
                        await route.continue(requestData)
                        break
                    case "proxy":
                        await useProxy(page.context(), route, { proxy: fingerprint.proxy, ...requestData })
                        break
                    case "abort":
                        await route.abort()
                        break
                }

            } else {
                if (!fingerprint.proxy) {
                    await route.continue(requestData)
                } else {
                    await useProxy(page.context(), route, { proxy, ...requestData })
                }
            }
        } catch (err) {
            console.error(err)
        }
    })

    page.on('response', async (response) => {
        try {
            await CacheResponse(response, options.cache.save);
        } catch (err){
            console.error(err)
        }
    });

    for (let plugin in evasionPlugins[browserType]) {
        if (evasionPlugins[browserType].hasOwnProperty(plugin)) {
            if(blacklistedEvasions.includes(plugin)) continue;

            await evasionPlugins[browserType][plugin](page, fingerprint)
        }
    }
}

async function LaunchBrowser(browserType, opts, fingerprint={}, rdp_port=0){
    if(!rdp_port) rdp_port = 10000 + Math.floor(Math.random() * 55565)
    let browser

    if(fingerprint.proxy == "direct://" || fingerprint.proxy == "direct") fingerprint.proxy = undefined

    let ipInfo = JSON.parse((await got({
        url: "https://lumtest.com/myip.json",
        agent: fingerprint.proxy ? setAgent(fingerprint.proxy) : undefined
    })).body)

    let userDataDir = opts.userDataDir;
    if(!userDataDir){
        userDataDir = path.join(tmpdir(), randomUUID());
    }

    mkdirSync(userDataDir, { recursive: true })

    switch(browserType){
        case "firefox":
            //browser = await firefox.launch({
            browser = await firefox.launchPersistentContext(userDataDir, {
                ...opts, 
                bypassCSP: true,
                screen: fingerprint ? {width: fingerprint.viewport.width, height: fingerprint.viewport.height} : null,
                proxy: undefined,
                args: [...(opts.args || []), '-start-debugger-server', String(rdp_port) ],
                firefoxUserPrefs: {
                    ...(opts.firefoxUserPrefs || {}),
                    'devtools.debugger.remote-enabled': true,
                    'devtools.debugger.prompt-connection': false,
                },
                geolocation: {
                    latitude: ipInfo.geo.latitude,
                    longitude: ipInfo.geo.longitude,
                    accuracy: smootherstep(0.1, 300, Math.random())
                },
                locale: countryLocaleMap.getLocaleByAlpha2(ipInfo.country),
                timezoneId: ipInfo.geo.tz
            });

            for (let extension in evasionExtensions[browserType]) {
                if (evasionExtensions[browserType].hasOwnProperty(extension)) {
                    await loadFirefoxAddon(rdp_port, "127.0.0.1", evasionExtensions[browserType][extension])
                }
            }

            break;
    }

    return {browser, ipInfo};
}

export { ConnectFingerprinter, LaunchBrowser, GetCommonFingerprint, GenerateFingerprint }
export default ConnectFingerprinter