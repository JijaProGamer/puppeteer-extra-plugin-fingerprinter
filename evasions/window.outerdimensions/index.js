'use strict'

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin')

/**
 * Fix missing window.outerWidth/window.outerHeight in headless mode
 * Will also set the viewport to match window size, unless specified by user
 */
class Plugin extends PuppeteerExtraPlugin {
  opts = {}

  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'fingerprinter/evasions/window.outerdimensions'
  }

  async onPageCreated(page) {
    await page.evaluateOnNewDocument((opts) => {
      try {
        const windowFrame = 80

        window.outerWidth = window.innerWidth = opts.viewport.width

        window.innerHeight = opts.viewport.height
        window.outerHeight = window.innerHeight + windowFrame

        window.availWidth = window.width = opts.viewport.width
        window.availHeight = window.height = opts.viewport.height
      } catch (err) {}
    }, this.opts)
  }

  async beforeLaunch(options) {
    this.opts = JSON.parse(JSON.stringify(options.opts))
  }
}

module.exports = function(pluginConfig) {
  return new Plugin(pluginConfig)
}
