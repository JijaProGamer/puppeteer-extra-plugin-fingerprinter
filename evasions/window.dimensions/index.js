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
    return 'fingerprinter/evasions/window.dimensions'
  }

  async onPageCreated(page) {
    await page.setViewport(this.opts.viewport)
  }

  async beforeLaunch(options) {
    this.opts = JSON.parse(JSON.stringify(options.opts))
    options.defaultViewport = options.opts.viewport
  }
}

module.exports = function (pluginConfig) {
  return new Plugin(pluginConfig)
}
