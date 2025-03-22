import got from "got";

import { HttpProxyAgent } from "http-proxy-agent";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";

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

const requestHandler = async (context, route, proxy, overrides = {}) => {
    let request = route.request()
    if (!request.url().startsWith("http") && !request.url().startsWith("https")) {
        request.continue()
        return
    }

    const options = {
        method: overrides.method,
        body: overrides.postData || undefined,
        headers: overrides.headers,
        agent: setAgent(proxy),
        responseType: "buffer",
        maxRedirects: 15,
        throwHttpErrors: false,
        ignoreInvalidCookies: true,
        followRedirect: true
    };

    try {
        const response = await got(overrides.url, options);

        await route.fulfill({
            status: response.statusCode,
            headers: response.headers,
            body: response.body,
        });
    } catch (error) {
        await route.abort();
    }
};

const useProxy = async (context, target, data) => {
    let proxy = data.proxy
    delete data.proxy

    if (proxy) {
        await requestHandler(context, target, proxy, data);
    } else {
        target.continue(data);
    }
};

export default useProxy;