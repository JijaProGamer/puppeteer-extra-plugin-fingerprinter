'use strict'

const utils = require('./_utils/withUtils.js')

class Plugin {
    async onPageCreated(page) {
        utils(page).evaluateOnNewDocument((utils) => {
            Object.defineProperty(document, 'hidden', {
                value: false,
                configurable: false
            });

            Object.defineProperty(document, 'visibilityState', {
                value: "visible",
                configurable: false
            });

            /*utils.replaceWithProxy(window.document,
                'hasFocus',
                {
                    apply: function (target, ctx, args) {
                        return true
                    }
                })*/
        })
    }
}

module.exports = (page, options) => {
    let plugin = new Plugin()
    plugin.onPageCreated(page, options)

    return plugin
}
