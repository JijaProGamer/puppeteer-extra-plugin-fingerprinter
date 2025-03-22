const { withUtils } = require("../../_utils.cjs");
const UAParser = require("ua-parser-js")

module.exports = async function (page, fingerprint) {
    let UA = new UAParser(fingerprint.userAgent);

    let OS = UA.getOS().name == "Windows"
        ? "Win32"
        : "Linux x86_64"

    await withUtils(page).addInitScript((utils, { fingerprint, OS }) => {
        /*

        utils.replaceGetterWithProxy(
            Object.getPrototypeOf(navigator),
            'platform',
            utils.makeHandler().getterValue(options.OS)
        )
        
        */
       
        /*Object.defineProperty(navigator, "productSub", {
            value: UA.getEngine().version,
            configurable: false,
            enumerable: false,
            writable: false
        });

        Object.defineProperty(navigator, "platform", {
            value: OS,
            configurable: false,
            enumerable: false,
            writable: false
        });

        Object.defineProperty(navigator, "userAgent", {
            value: options.fingerprint.userAgent,
            configurable: false,
            enumerable: false,
            writable: false
        });*/

        utils.replaceGetterWithProxy(
            Object.getPrototypeOf(navigator),
            'platform',
            utils.makeHandler().getterValue(OS)
        )

        utils.replaceGetterWithProxy(
            Object.getPrototypeOf(navigator),
            'userAgent',
            utils.makeHandler().getterValue(fingerprint.userAgent)
        )
    }, { fingerprint, OS });
}