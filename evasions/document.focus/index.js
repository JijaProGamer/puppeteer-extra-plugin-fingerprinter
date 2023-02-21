'use strict'

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin')
const withUtils = require('../_utils/withUtils')

/**
 * Pass the Webdriver Test.
 * Will delete `navigator.webdriver` property.
 */
class Plugin extends PuppeteerExtraPlugin {
  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'fingerprinter/evasions/navigator.webdriver'
  }

  async onPageCreated(page) {
    await withUtils(page).evaluateOnNewDocument(async (utils) => {
      const hasFocus = {
        apply: function (target, ctx, args) {
          return true
        }
      }

      Object.defineProperty(window.document, 'hidden', {
        get: function () {
          return false;
        },
        configurable: true
      })
      Object.defineProperty(window.document, 'visibilityState', {
        get: function () {
          return 'visible';
        },
        configurable: true
      })

      utils.replaceWithProxy(
        document,
        'hasFocus',
        hasFocus
      )
    })
  }
}

module.exports = function (pluginConfig) {
  return new Plugin(pluginConfig)
}
