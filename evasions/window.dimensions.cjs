'use strict'

const utils = require('./_utils/withUtils.js')

class Plugin {
    async onPageCreated(page, options) {
        page.setViewport(options.viewport)

        utils(page).evaluateOnNewDocument((utils, options) => {
            const windowFrame = 80
            const windowBar = 40

            window.outerWidth = window.innerWidth = options.viewport.width
    
            window.innerHeight = options.viewport.height
            window.outerHeight = window.innerHeight + windowFrame + windowBar
    
            window.availWidth = window.width = options.viewport.width
            window.availHeight = window.height = options.viewport.height
        }, options)
    }
}

module.exports = (page, options) => {
    let plugin = new Plugin()
    plugin.onPageCreated(page, options)

    return plugin
}
