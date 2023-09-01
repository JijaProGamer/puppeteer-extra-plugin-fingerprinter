'use strict'

const utils = require('./_utils/withUtils.js')

class Plugin {
    async onPageCreated(page, options) {
        utils(page).evaluateOnNewDocument((utils, options) => {
            const originalFunction = HTMLCanvasElement.prototype.toDataURL.bind({arguments: ["image/png"]});

            /*const getCanvasProxyHandler = {
                apply: function (target, ctx, args) {
                const result = utils.cache.Reflect.apply(target, ctx, args)
                let canvas_element = ctx.cloneNode()
                let canvas_context = canvas_element.getContext("2d")
                console.log(0)

                let image = new Image()
                image.src = result;
                canvas_context.drawImage(image, 0, 0)

                console.log(1)

                const imageData = canvas_context.getImageData(0, 0, 100, 199);
                
                for(let i = 0; x < imageData.data.length ; i++){
                    imageData.data[i] = 0
                }

                console.log(originalFunction.apply)
                let new_result = originalFunction.apply(canvas_element, args)
                console.log(2)

                return new_result
                }
            }

            utils.replaceWithProxy(HTMLCanvasElement.prototype, 'toDataURL', getCanvasProxyHandler)*/
        }, options)
    }
}

module.exports = (page, options) => {
    let plugin = new Plugin()
    plugin.onPageCreated(page, options)

    return plugin
}
