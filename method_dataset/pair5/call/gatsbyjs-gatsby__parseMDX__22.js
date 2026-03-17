const parseMDX = async (source: string): Promise<string | Buffer | void> => {
  getNodeMock.mockImplementation(() => {
    return {
      body: source,
    }
  })

  const JSXSource = await gatsbyMDXLoader.call(
    {
      getOptions: () => {
        return {
          options: {},
          getNode,
          cache,
          reporter,
        }
      },
      resourcePath,
      resourceQuery,
      addDependency: jest.fn(),
    } as unknown as LoaderContext<string>,
    source
  )
  getNodeMock.mockImplementation(() => {
    return {
      body: JSXSource,
    }
  })

  const loaderPromise = gatsbyLayoutLoader.call(
    {
      getOptions: () => {
        return {
          nodeExists,
          reporter,
        }
      },
      resourcePath: `/mocked-layout.ts`,
      resourceQuery: `?contentFilePath=/mocked-content.mdx`,
      addDependency: jest.fn(),
    } as unknown as LoaderContext<string>,
    String(JSXSource)
  )

  return loaderPromise
}
