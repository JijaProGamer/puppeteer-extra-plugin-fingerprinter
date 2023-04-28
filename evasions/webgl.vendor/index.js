'use strict'

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin')
const withUtils = require('../_utils/withUtils')

/**
 * Fix WebGL Vendor/Renderer being set to Google in headless mode
 *
 * Example data (Apple Retina MBP 13): {vendor: "Intel Inc.", renderer: "Intel(R) Iris(TM) Graphics 6100"}
 *
 * @param {Object} [opts] - Options
 * @param {string} [opts.vendor] - The vendor string to use (default: `Intel Inc.`)
 * @param {string} [opts.renderer] - The renderer string (default: `Intel Iris OpenGL Engine`)
 */
class Plugin extends PuppeteerExtraPlugin {
  opts = {}

  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'fingerprinter/evasions/webgl.vendor'
  }

  /* global WebGLRenderingContext WebGL2RenderingContext */
  async onPageCreated(page) {
    await withUtils(page).evaluateOnNewDocument(async (utils, opts) => {
      const getParameterProxyHandler = {
        apply: function (target, ctx, args) {
          const param = (args || [])[0]
          const result = utils.cache.Reflect.apply(target, ctx, args)

          if (param === 37445) {
            return opts.webgl_vendor // default in headless: Google Inc.
          }
          if (param === 37446) {
            return opts.webgl_renderer // default in headless: Google SwiftShader
          }

          return result
        }
      }

      const originalFunction = HTMLCanvasElement.prototype.toDataURL.bind({arguments: ["image/png"]});

      /*const getCanvasProxyHandler = {
        apply: function (target, ctx, args) {
          const result = utils.cache.Reflect.apply(target, ctx, args)
          let canvas_element = ctx.cloneNode()
          let canvas_context = canvas_element.getContext("2d")
          console.log(0)

          let image = new Image()
          image.src = result;
          canvas_context.drawImage(image, 0, 0)

          console.log(1)

          const imageData = canvas_context.getImageData(0, 0, 100, 199);
          
          for(let i = 0; x < imageData.data.length ; i++){
            imageData.data[i] = 0
          }

          console.log(originalFunction.apply)
          let new_result = originalFunction.apply(canvas_element, args)
          console.log(2)

          return new_result
        }
      }

      utils.replaceWithProxy(HTMLCanvasElement.prototype, 'toDataURL', getCanvasProxyHandler)*/

      utils.replaceWithProxy(WebGLRenderingContext.prototype, 'getParameter', getParameterProxyHandler)
      utils.replaceWithProxy(WebGL2RenderingContext.prototype, 'getParameter', getParameterProxyHandler)

    }, this.opts)
  }

  async beforeLaunch(options) {
    this.opts = JSON.parse(JSON.stringify(options.opts))
  }
}

module.exports = function (pluginConfig) {
  return new Plugin(pluginConfig)
}
