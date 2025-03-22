module.exports = async function (page, fingerprint) {
    console.log(fingerprint.viewport)
    await page.setViewportSize({
        width: fingerprint.viewport.width,
        height: fingerprint.viewport.height
    });
};
