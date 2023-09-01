'use strict'

const UAParser = require("ua-parser-js")
const utils = require('./_utils/withUtils.js')

class Plugin {
    async onPageCreated(page, options) {
        page.setUserAgent(options.userAgent)

        let parser = new UAParser(options.userAgent);
        let OS = parser.getOS().name == "Windows"
            ? "Win32"
            : "Linux x86_64"

        utils(page).evaluateOnNewDocument((utils, options) => {
            utils.replaceGetterWithProxy(
                Object.getPrototypeOf(navigator),
                'platform',
                utils.makeHandler().getterValue(options.OS)
            )
        }, {...options, OS})
    }
}

module.exports = (page, options) => {
    let plugin = new Plugin()
    plugin.onPageCreated(page, options)

    return plugin
}
