const { withUtils } = require("../../_utils.cjs");

module.exports = async function (page, fingerprint) {
    withUtils(page).addInitScript((utils, { fingerprint }) => {
        const getParameter = {
            apply: function (target, ctx, args) {
                const param = (args || [])[0]

                if (param === 37445) {
                    return fingerprint.webgl_vendor
                }
                if (param === 37446) {
                    return fingerprint.webgl_renderer
                }

                const result = utils.cache.Reflect.apply(target, ctx, args)

                return result
            }
        }

        utils.replaceWithProxy(WebGLRenderingContext.prototype, 'getParameter', getParameter)
        utils.replaceWithProxy(WebGL2RenderingContext.prototype, 'getParameter', getParameter)
    }, { fingerprint })
}