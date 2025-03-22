module.exports = async function (page, fingerprint) {
    await page.addInitScript((options) => {
        Object.defineProperty(document, 'hidden', {
            value: false,
            configurable: false
        });
        
        Object.defineProperty(document, 'visibilityState', {
            value: "visible",
            configurable: false
        });
    }, { fingerprint });
}