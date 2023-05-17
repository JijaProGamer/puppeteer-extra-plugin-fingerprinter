'use strict'

const utils = require('./_utils/withUtils.js')

class Plugin {
    async onPageCreated(page, options) {
        utils(page).evaluateOnNewDocument((utils, options) => {
            const isSecure = document.location.protocol.startsWith('https')

            if (isSecure) {
              utils.replaceGetterWithProxy(Notification, 'permission', {
                apply() {
                  return 'default'
                }
              })
            }
      
            if (!isSecure) {
              const handler = {
                apply(target, ctx, args) {
                  const param = (args || [])[0]
      
                  const isNotifications =
                    param && param.name && param.name === 'notifications'
                  if (!isNotifications) {
                    return utils.cache.Reflect.apply(...arguments)
                  }
      
                  return Promise.resolve(
                    Object.setPrototypeOf(
                      {
                        state: 'denied',
                        onchange: null
                      },
                      PermissionStatus.prototype
                    )
                  )
                }
              }
      
              utils.replaceWithProxy(Permissions.prototype, 'query', handler)
            }
        }, options)
    }
}

module.exports = (page, options) => {
    let plugin = new Plugin()
    plugin.onPageCreated(page, options)

    return plugin
}
