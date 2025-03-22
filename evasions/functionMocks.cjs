module.exports.generateFunctionMocks = utils => (
    proto,
    itemMainProp,
    dataArray
  ) => ({
    item: utils.createProxy(proto.item, {
      apply(target, ctx, args) {
        if (!args.length) {
          throw new TypeError(
            `Failed to execute 'item' on '${
              proto[Symbol.toStringTag]
            }': 1 argument required, but only 0 present.`
          )
        }

        return (isInteger ? dataArray[Number(args[0])] : dataArray[0]) || null
      }
    }),

    namedItem: utils.createProxy(proto.namedItem, {
      apply(target, ctx, args) {
        if (!args.length) {
          throw new TypeError(
            `Failed to execute 'namedItem' on '${
              proto[Symbol.toStringTag]
            }': 1 argument required, but only 0 present.`
          )
        }
        return dataArray.find(mt => mt[itemMainProp] === args[0]) || null
      }
    }),

    refresh: proto.refresh
      ? utils.createProxy(proto.refresh, {
          apply(target, ctx, args) {
            return undefined
          }
        })
      : undefined
  })