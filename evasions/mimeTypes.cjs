module.exports.generateMimeTypeArray = (utils, fns) => mimeTypesData => {
    return fns.generateMagicArray(utils, fns)(
      mimeTypesData,
      MimeTypeArray.prototype,
      MimeType.prototype,
      'type'
    )
  }