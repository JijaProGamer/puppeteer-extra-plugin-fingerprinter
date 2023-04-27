'use strict'

const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin')

const withUtils = require('../_utils/withUtils')

/**
 * Fix Chromium not reporting "probably" to codecs like `videoEl.canPlayType('video/mp4; codecs="avc1.42E01E"')`.
 * (Chromium doesn't support proprietary codecs, only Chrome does)
 */
class Plugin extends PuppeteerExtraPlugin {
  opts = {}

  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'fingerprinter/evasions/media.codecs'
  }

  async onPageCreated(page) {
    await withUtils(page).evaluateOnNewDocument(async (utils, opts) => {
      const parseInput = arg => {
        const [mime, codecStr] = arg.trim().split(';')
        let codecs = []
        if (codecStr && codecStr.includes('codecs="')) {
          codecs = codecStr
            .trim()
            .replace(`codecs="`, '')
            .replace(`"`, '')
            .trim()
            .split(',')
            .filter(x => !!x)
            .map(x => x.trim())
        }
        return {
          mime,
          codecStr,
          codecs
        }
      }

      const canPlayType = {
        apply: function (target, ctx, args) {
          if (!args || !args.length) {
            return target.apply(ctx, args)
          }

          const { mime, codecs } = parseInput(args[0])

          let [type, container] = mime.split("/")

          switch (type) {
            case "audio":
              if (opts.compatibleMediaMimes.audio.includes(container)) {
                return "probably"
              }

              return ""
            case "video":
              let videoContainer = opts.compatibleMediaMimes.video[container]
              if (videoContainer) {
                let codecFound = codecs.some(codec => videoContainer.includes(codec))
                if (codecFound || codecs.length == 0) {
                  return "probably"
                }
              }

              return ""
          }

          return target.apply(ctx, args)
        }
      }

      const isTypeSupported = {
        apply: function (target, ctx, args) {
          if (!args || !args.length) {
            return target.apply(ctx, args)
          }

          const { mime, codecs } = parseInput(args[0])

          let [type, container] = mime.split("/")

          switch (type) {
            case "audio":
              if (opts.compatibleMediaMimes.audio.includes(container)) {
                return true
              }

              return ""
            case "video":
              let videoContainer = opts.compatibleMediaMimes.video[container]
              if (videoContainer) {
                let codecFound = codecs.some(codec => videoContainer.includes(codec))
                if (codecFound || codecs.length == 0) {
                  return true
                }
              }

              return false
          }

          return target.apply(ctx, args)
        }
      }

      utils.replaceWithProxy(
        HTMLMediaElement.prototype,
        'canPlayType',
        canPlayType
      )

      utils.replaceWithProxy(
        MediaRecorder.prototype,
        'isTypeSupported',
        isTypeSupported
      )

      utils.replaceWithProxy(
        MediaSource.prototype,
        'isTypeSupported',
        isTypeSupported
      )
    }, this.opts)
  }

  async beforeLaunch(options) {
    this.opts = JSON.parse(JSON.stringify(options.opts))
  }
}

module.exports = function (pluginConfig) {
  return new Plugin(pluginConfig)
}
