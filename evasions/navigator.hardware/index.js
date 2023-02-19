'use strict'

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin')

const withUtils = require('../_utils/withUtils')

/**
 * Set the hardwareConcurrency to 4 (optionally configurable with `hardwareConcurrency`)
 *
 * @see https://arh.antoinevastel.com/reports/stats/osName_hardwareConcurrency_report.html
 *
 * @param {Object} [opts] - Options
 * @param {number} [opts.hardwareConcurrency] - The value to use in `navigator.hardwareConcurrency` (default: `4`)
 */

class Plugin extends PuppeteerExtraPlugin {
  opts = {}

  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'fingerprinter/evasions/navigator.hardwareConcurrency'
  }

  async onPageCreated(page) {
    await withUtils(page).evaluateOnNewDocument(
      async (utils, opts) => {
        utils.replaceGetterWithProxy(Object.getPrototypeOf(navigator),
          'hardwareConcurrency',
          utils.makeHandler().getterValue(opts.cpus)
        )

        utils.replaceGetterWithProxy(Object.getPrototypeOf(navigator),
          'deviceMemory',
          utils.makeHandler().getterValue(opts.memory)
        )
      }, this.opts
    )
  }

  async beforeLaunch(options) {
    this.opts = JSON.parse(JSON.stringify(options.opts))
  }
}

module.exports = function (pluginConfig) {
  return new Plugin(pluginConfig)
}
