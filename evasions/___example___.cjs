'use strict'

const utils = require('./_utils/withUtils.js')

class Plugin {
    async onPageCreated(page, options) {
        utils(page).evaluateOnNewDocument((utils, options) => {
            
        }, options)
    }
}

module.exports = (page, options) => {
    let plugin = new Plugin()
    plugin.onPageCreated(page, options)

    return plugin
}
