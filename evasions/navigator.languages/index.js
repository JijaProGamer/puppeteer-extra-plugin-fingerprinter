'use strict'

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin')
const withUtils = require('../_utils/withUtils')

/**
 * Pass the Languages Test. Allows setting custom languages.
 *
 * @param {Object} [opts] - Options
 * @param {Array<string>} [opts.languages] - The languages to use (default: `['en-US', 'en']`)
 */
class Plugin extends PuppeteerExtraPlugin {
  opts = {}

  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'fingerprinter/evasions/navigator.languages'
  }

  async onPageCreated(page) {
    await page.setExtraHTTPHeaders({
      'Accept-Language': `${this.opts.language};q=0.5`
    });

    await withUtils(page).evaluateOnNewDocument(
      async (utils, opts) => {
        utils.replaceGetterWithProxy(
          Object.getPrototypeOf(navigator),
          'languages',
          utils.makeHandler().getterValue(Object.freeze([...opts.language.split(",")]))
        )

        utils.replaceGetterWithProxy(Object.getPrototypeOf(navigator),
          'language',
          utils.makeHandler().getterValue(opts.language.split(",")[0])
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
