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
      const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
      const blacklistedLetters = ["+", "/"]
      const whitelistedLetters = ["k", "p", "j"]

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

      const getCanvasProxyHandler = {
        apply: function (target, ctx, args) {
          const result = utils.cache.Reflect.apply(target, ctx, args)
          let image = result.split(",")[1]//.slice(0,-2)
          let newString = ""
          for (let [index, letter] of [...image].entries()) {
            let alphabetLetter = alphabet.indexOf(letter)

            if (index % opts.canvas.chance == 0 && alphabetLetter && alphabetLetter > opts.canvas.shift && !blacklistedLetters.includes(letter) && whitelistedLetters.includes(letter)) {
              newString += alphabet[alphabetLetter - opts.canvas.shift]
            } else {
              newString += letter
            }
          }

          return `${result.split(",")[0]},${newString}`
        }
      }

      utils.replaceWithProxy(HTMLCanvasElement.prototype, 'toDataURL', getCanvasProxyHandler)

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
