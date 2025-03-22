import { CookieJar } from "tough-cookie";

class CookieHandler {
    constructor(context, request) {
        this.context = context
        this.url =
            (request.isNavigationRequest() || request.frame() == null)
            ? request.url()
            : request.frame().url();

        this.domain = (this.url) ? new URL(this.url).hostname : "";
    }

    formatCookies(cookies) {
        return cookies.map((cookie) => {
            const currentDate = new Date().toISOString();

            return {
                key: cookie.name,
                value: cookie.value,
                expires: (cookie.expires === -1) ? "Infinity" : new Date(cookie.expires * 1000).toISOString(),
                domain: cookie.domain.replace(/^\./, ""),
                path: cookie.path,
                secure: cookie.secure,
                httpOnly: cookie.httpOnly,
                sameSite: cookie.sameSite,
                hostOnly: !cookie.domain.startsWith("."),
                creation: currentDate,
                lastAccessed: currentDate
            };
        });
    };

    async getCookies() {
        const toughCookies = this.formatCookies(await this.context.getCookies([this.url]));

        const cookieJar = CookieJar.deserializeSync({
            version: 'tough-cookie@4.1.2',
            storeType: 'MemoryCookieStore',
            rejectPublicSuffixes: true,
            cookies: toughCookies
        });
        return cookieJar;
    }
}

export default CookieHandler;