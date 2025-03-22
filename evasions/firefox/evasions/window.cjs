module.exports = async function (page, fingerprint) {
    await page.setViewportSize({
        width: fingerprint.viewport.width,
        height: fingerprint.viewport.height
    });
};
