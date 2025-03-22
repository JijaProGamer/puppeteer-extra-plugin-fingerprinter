'use strict';

import LRU from 'lru-cache';
import Agent from 'agent-base';
import * as http from 'http';
import * as https from 'https';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

export default ProxyAgent;


const cacheSize = 20;

export const cache = new LRU(cacheSize);

export const proxies = Object.create(null);
proxies.http = httpOrHttpsProxy;
proxies.https = httpOrHttpsProxy;
proxies.socks = SocksProxyAgent;
proxies.socks4 = SocksProxyAgent;
proxies.socks4a = SocksProxyAgent;
proxies.socks5 = SocksProxyAgent;
proxies.socks5h = SocksProxyAgent;

function httpOrHttps(opts, secureEndpoint) {
    return secureEndpoint ? https.globalAgent : http.globalAgent;
}

function httpOrHttpsProxy(opts, secureEndpoint) {
    return secureEndpoint ? new HttpsProxyAgent(opts) : new HttpProxyAgent(opts);
}

function mapOptsToProxy(opts) {
    if (!opts) {
        return {
            uri: 'no proxy',
            fn: httpOrHttps,
        };
    }

    if (typeof opts === 'string') opts = new URL(opts);

    let proxies;
    proxies = exports.proxies;

    let protocol = opts.protocol;
    if (!protocol) {
        throw new TypeError(
            'You must specify a "protocol" for the ' +
            'proxy type (' +
            Object.keys(proxies).join(', ') +
            ')'
        );
    }

    if (protocol.endsWith(':')) {
        protocol = protocol.substring(0, protocol.length - 1);
    }

    let proxyFn = proxies[protocol];

    if (typeof proxyFn == 'undefined') {
        throw new TypeError('unsupported proxy protocol: "' + protocol + '"');
    } else {
        if (typeof proxyFn == 'object') {
            proxyFn = Object.values(proxyFn)[0];
        }
    }

    return {
        opts: opts,
        uri: opts.href,
        fn: proxyFn,
    };
}

class ProxyAgent extends Agent {
    constructor(opts) {
        super();
        if (opts) {
            const proxy = mapOptsToProxy(opts);
            this.proxy = proxy.opts;
            this.proxyUri = proxy.uri;
            this.proxyFn = proxy.fn;
        }
    }

    callback(req, opts, fn) {
        let proxyOpts = this.proxy;
        let proxyUri = this.proxyUri;
        let proxyFn = this.proxyFn;

        let key = proxyUri;
        if (opts.secureEndpoint) key += ' secure';

        let agent = cache.get(key);
        if (!agent) {
            agent = new proxyFn(proxyOpts, opts.secureEndpoint);
            if (agent) {
                cache.set(key, agent);
            }
        }

        if (!proxyOpts) {
            agent.addRequest(req, opts);
        } else {
            agent
                .callback(req, opts)
                .then(function (socket) {
                    fn(null, socket);
                })
                .catch(function (error) {
                    fn(error);
                });
        }
    }
}