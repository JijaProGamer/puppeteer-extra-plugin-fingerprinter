'use strict'

const utils = require('./_utils/withUtils.js')

class Plugin {
    async onPageCreated(page, options) {
        await utils(page).evaluateOnNewDocument((utils, options) => {
            const parseInput = (arg) => {
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
                    if (options.compatibleMediaMimes.audio.includes(container)) {
                      return "probably"
                    }
      
                    return ""
                  case "video":
                    let videoContainer = options.compatibleMediaMimes.video[container]
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
                    if (options.compatibleMediaMimes.audio.includes(container)) {
                      return true
                    }
      
                    return ""
                  case "video":
                    let videoContainer = options.compatibleMediaMimes.video[container]
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
              MediaRecorder,
              'isTypeSupported',
              isTypeSupported
            )
      
            utils.replaceWithProxy(
                MediaRecorder,
                'isTypeSupported',
                isTypeSupported
            )
          }, options)
    }
}

module.exports = (page, options) => {
    let plugin = new Plugin()
    plugin.onPageCreated(page, options)

    return plugin
}
