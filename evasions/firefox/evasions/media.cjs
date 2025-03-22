const { withUtils } = require("../../_utils.cjs");

module.exports = async function (page, fingerprint) {
    withUtils(page).addInitScript((utils, { fingerprint }) => {
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
                  if (fingerprint.compatibleMediaMime.audio.includes(container)) {
                    return "probably"
                  }
    
                  return ""
                case "video":
                  let videoContainer = fingerprint.compatibleMediaMime.video[container]
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
                  if (options.compatibleMediaMime.audio.includes(container)) {
                    return true
                  }
    
                  return ""
                case "video":
                  let videoContainer = options.compatibleMediaMime.video[container]
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
    }, { fingerprint });
}