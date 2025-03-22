const { withUtils, utils } = require("../../_utils.cjs");
const UAParser = require("ua-parser-js")

const data = require('../../pluginList.json')

const { generateMimeTypeArray } = require('../../mimeTypes.cjs')
const { generatePluginArray } = require('../../plugins.cjs')
const { generateMagicArray } = require('../../magicArray.cjs')
const { generateFunctionMocks } = require('../../functionMocks.cjs')

module.exports = async function (page, fingerprint) {
    await withUtils(page).addInitScript(
        (utils, { fns, data }) => {
            fns = utils.materializeFns(fns)

            const hasPlugins = 'plugins' in navigator && navigator.plugins.length
            if (hasPlugins) {
                return
            }

            const mimeTypes = fns.generateMimeTypeArray(utils, fns)(data.mimeTypes)
            const plugins = fns.generatePluginArray(utils, fns)(data.plugins)

            for (const pluginData of data.plugins) {
                pluginData.__mimeTypes.forEach((type, index) => {
                    plugins[pluginData.name][index] = mimeTypes[type]

                    Object.defineProperty(plugins[pluginData.name], type, {
                        value: mimeTypes[type],
                        writable: false,
                        enumerable: false, 
                        configurable: true
                    })
                    Object.defineProperty(mimeTypes[type], 'enabledPlugin', {
                        value:
                            type === 'application/x-pnacl'
                                ? mimeTypes['application/x-nacl'].enabledPlugin
                                : new Proxy(plugins[pluginData.name], {}),
                        writable: false,
                        enumerable: false,
                        configurable: true
                    })
                })
            }

            const patchNavigator = (name, value) =>
                utils.replaceProperty(Object.getPrototypeOf(navigator), name, {
                    get() {
                        return value
                    }
                })

            patchNavigator('mimeTypes', mimeTypes)
            patchNavigator('plugins', plugins)
        },
        {
            fns: utils.stringifyFns({
                generateMimeTypeArray,
                generatePluginArray,
                generateMagicArray,
                generateFunctionMocks
            }),
            data
        }
    )
}