module.exports.generatePluginArray = (utils, fns) => pluginsData => {
    return fns.generateMagicArray(utils, fns)(
      pluginsData,
      PluginArray.prototype,
      Plugin.prototype,
      'name'
    )
  }