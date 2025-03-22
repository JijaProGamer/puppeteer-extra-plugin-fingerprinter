function applyUtils(page, onInit = false){
    let func = onInit ? page.addInitScript : page.evaluate
    page.addInitScript()
    func()
}

module.exports = applyUtils