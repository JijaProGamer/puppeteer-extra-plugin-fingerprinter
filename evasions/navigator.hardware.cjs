'use strict'

const utils = require('./_utils/withUtils.js')

class Plugin {
    async onPageCreated(page, options) {
        utils(page).evaluateOnNewDocument((utils, options) => {
            utils.replaceGetterWithProxy(Object.getPrototypeOf(navigator),
                'hardwareConcurrency',
                utils.makeHandler().getterValue(options.cpus)
            )
    
            utils.replaceGetterWithProxy(Object.getPrototypeOf(navigator),
                'deviceMemory',
                utils.makeHandler().getterValue(options.memory)
            )
    
            utils.replaceGetterWithProxy(Object.getPrototypeOf(performance.memory),
                'jsHeapSizeLimit',
                utils.makeHandler().getterValue(options.memory * 1000000000)
            )
        }, options)
    }
}

module.exports = (page, options) => {
    let plugin = new Plugin()
    plugin.onPageCreated(page, options)

    return plugin
}
