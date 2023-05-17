'use strict'

const utils = require('./_utils/withUtils.js')

class Plugin {
    async onPageCreated(page) {
        utils(page).evaluateOnNewDocument((utils) => {
            utils.replaceGetterWithProxy(
                Object.getPrototypeOf(navigator),
                'webdriver',
                utils.makeHandler().getterValue(false)
            )
        })
    }
}

module.exports = (page, options) => {
    let plugin = new Plugin()
    plugin.onPageCreated(page, options)

    return plugin
}
