module.exports.generateMagicArray = (utils, fns) =>
    function(
      dataArray = [],
      proto = MimeTypeArray.prototype,
      itemProto = MimeType.prototype,
      itemMainProp = 'type'
    ) {
      const defineProp = (obj, prop, value) =>
        Object.defineProperty(obj, prop, {
          value,
          writable: false,
          enumerable: false,
          configurable: true
        })
  
      const makeItem = data => {
        const item = {}
        for (const prop of Object.keys(data)) {
          if (prop.startsWith('__')) {
            continue
          }
          defineProp(item, prop, data[prop])
        }
        return patchItem(item, data)
      }
  
      const patchItem = (item, data) => {
        let descriptor = Object.getOwnPropertyDescriptors(item)
  
        if (itemProto === Plugin.prototype) {
          descriptor = {
            ...descriptor,
            length: {
              value: data.__mimeTypes.length,
              writable: false,
              enumerable: false,
              configurable: true
            }
          }
        }
  
        const obj = Object.create(itemProto, descriptor)
  
        const blacklist = [...Object.keys(data), 'length', 'enabledPlugin']
        return new Proxy(obj, {
          ownKeys(target) {
            return Reflect.ownKeys(target).filter(k => !blacklist.includes(k))
          },
          getOwnPropertyDescriptor(target, prop) {
            if (blacklist.includes(prop)) {
              return undefined
            }
            return Reflect.getOwnPropertyDescriptor(target, prop)
          }
        })
      }
  
      const magicArray = []
  
      dataArray.forEach(data => {
        magicArray.push(makeItem(data))
      })
  
      magicArray.forEach(entry => {
        defineProp(magicArray, entry[itemMainProp], entry)
      })
  
      const magicArrayObj = Object.create(proto, {
        ...Object.getOwnPropertyDescriptors(magicArray),
  
        length: {
          value: magicArray.length,
          writable: false,
          enumerable: false,
          configurable: true
        }
      })
  
      const functionMocks = fns.generateFunctionMocks(utils)(
        proto,
        itemMainProp,
        magicArray
      )
  
      const magicArrayObjProxy = new Proxy(magicArrayObj, {
        get(target, key = '') {
          if (key === 'item') {
            return functionMocks.item
          }
          if (key === 'namedItem') {
            return functionMocks.namedItem
          }
          if (proto === PluginArray.prototype && key === 'refresh') {
            return functionMocks.refresh
          }
          return utils.cache.Reflect.get(...arguments)
        },
        ownKeys(target) {
          const keys = []
          const typeProps = magicArray.map(mt => mt[itemMainProp])
          typeProps.forEach((_, i) => keys.push(`${i}`))
          typeProps.forEach(propName => keys.push(propName))
          return keys
        },
        getOwnPropertyDescriptor(target, prop) {
          if (prop === 'length') {
            return undefined
          }
          return Reflect.getOwnPropertyDescriptor(target, prop)
        }
      })
  
      return magicArrayObjProxy
    }