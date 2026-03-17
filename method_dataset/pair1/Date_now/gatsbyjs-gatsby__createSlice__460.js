function __method_wrapper__() {
  createSlice: (
    payload: ICreateSliceInput,
    plugin: IGatsbyPlugin,
    traceId?: string
  ): ICreateSliceAction => {
    if (_CFLAGS_.GATSBY_MAJOR === `5` && process.env.GATSBY_SLICES) {
      let name = `The plugin "${plugin.name}"`
      if (plugin.name === `default-site-plugin`) {
        name = `Your site's "gatsby-node.js"`
      }

      if (!payload.id) {
        const message = `${name} must set the page path when creating a slice`
        report.panic({
          id: `11334`,
          context: {
            pluginName: name,
            sliceObject: payload,
            message,
          },
        })
      }

      const { slices } = store.getState()

      const { error, panicOnBuild } = validateComponent({
        input: payload,
        pluginName: name,
        errorIdMap: {
          noPath: `11333`,
          notAbsolute: `11335`,
          doesNotExist: `11336`,
          empty: `11337`,
          noDefaultExport: `11338`,
        },
      })

      if (error && process.env.NODE_ENV !== `test`) {
        if (panicOnBuild) {
          report.panicOnBuild(error)
        } else {
          report.panic(error)
        }
      }

      const componentPath = normalizePath(payload.component)

      const oldSlice = slices.get(payload.id)
      const contextModified =
        !!oldSlice && !isEqual(oldSlice.context, payload.context)
      const componentModified =
        !!oldSlice && !isEqual(oldSlice.componentPath, componentPath)

      return {
        type: `CREATE_SLICE`,
        plugin,
        payload: {
          componentChunkName: generateComponentChunkName(
            payload.component,
            `slice`
          ),
          componentPath,
          // note: we use "name" internally instead of id
          name: payload.id,
          context: payload.context || {},
          updatedAt: Date.now(),
        },
        traceId,
        componentModified,
        contextModified,
      }
    } else {
      throw new Error(`createSlice is only available in Gatsby v5`)
    }
  },

}
