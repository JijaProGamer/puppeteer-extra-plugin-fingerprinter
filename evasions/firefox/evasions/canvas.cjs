const { withUtils } = require("../../_utils.cjs");

module.exports = async function (page, fingerprint) {
    withUtils(page).addInitScript((utils, { fingerprint }) => {        
        /*const getCanvasProxyHandler = {
            apply: function (target, ctx, args) {
                class ImageDecoder {
                    constructor(base64Image, width, height) {
                        this.width = width;
                        this.height = height;

                        let type = base64Image.split(',')[0]
                        let base64Data = base64Image.split(',')[1];

                        this.blob = base64toBlob(base64Data, type)
                        this.dataView = new DataView(byteArray.buffer);
                    }

                    getPixel(x, y) {
                        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                            throw new Error("Pixel coordinates are out of bounds.");
                        }

                        let position = (y * this.width + x) * 4;

                        let r = this.dataView.getUint8(position);
                        let g = this.dataView.getUint8(position + 1);
                        let b = this.dataView.getUint8(position + 2);
                        let a = this.dataView.getUint8(position + 3);

                        return { r, g, b, a };
                    }
                }

                try {

                const canvas = document.createElement('canvas');
                let canvas_context = canvas.getContext("2d")

                canvas.width = ctx.width;
                canvas.height = ctx.height;

                const result = utils.cache.Reflect.apply(target, ctx, args)
                const decoded = new ImageDecoder(result, canvas.width, canvas.height)

                const imageData = canvas_context.getImageData(0, 0, canvas.width, canvas.height);

                function setPixel(x, y, pixel) {
                    const index = (y * ctx.width + x) * 4

                    imageData.data[index] = Math.floor(pixel.r);
                    imageData.data[index + 1] = Math.floor(pixel.g);
                    imageData.data[index + 2] = Math.floor(pixel.b);
                    imageData.data[index + 3] = Math.floor(pixel.a);
                }

                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        let pixel = decoded.getPixel(x, y);

                        pixel.r = (x / canvas.width) * 255
                        //pixel.b += (y / canvas.height) * 255
                        //pixel.g += 255 - (pixel.r + pixel.b) / 2

                        setPixel(x, y, pixel)
                    }
                }

                canvas_context.putImageData(imageData, 0, 0);

                let new_result = utils.cache.Reflect.apply(target, canvas, args)
                return new_result
            }catch(err){console.log(err)}
            }
        }

        utils.replaceWithProxy(HTMLCanvasElement.prototype, 'toDataURL', getCanvasProxyHandler)*/
    }, { fingerprint });
}