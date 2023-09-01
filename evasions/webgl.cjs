'use strict'

const utils = require('./_utils/withUtils.js')

class Plugin {
    async onPageCreated(page, options) {
        utils(page).evaluateOnNewDocument((utils, options) => {
            const getParameterProxyHandler = {
                apply: function (target, ctx, args) {
                  const param = (args || [])[0]
                  const result = utils.cache.Reflect.apply(target, ctx, args)
        
                  if (param === 37445) {
                    return options.webgl_vendor
                  }
                  if (param === 37446) {
                    return options.webgl_renderer
                  }
        
                  return result
                }
              }
                
              utils.replaceWithProxy(WebGLRenderingContext.prototype, 'getParameter', getParameterProxyHandler)
              utils.replaceWithProxy(WebGL2RenderingContext.prototype, 'getParameter', getParameterProxyHandler)
        
        }, options)
    }
}

module.exports = (page, options) => {
    let plugin = new Plugin()
    plugin.onPageCreated(page, options)

    return plugin
}
