function __method_wrapper__() {
  it(`parses file with frontmatter data`, async () => {
    const resourcePath = `/mocked`
    const resourceQuery = `mocked`
    getNodeMock.mockImplementation(() => {
      return {
        body: source,
      }
    })
    cache.set(createFileToMdxCacheKey(resourcePath), 123)

    const transformedSourcePromise = gatsbyMDXLoader.call(
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
    await expect(transformedSourcePromise).resolves.toMatchInlineSnapshot(`
            "/*@jsxRuntime automatic @jsxImportSource react*/
            import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from \\"react/jsx-runtime\\";
            import Example from \\"./example\\";
            function _createMdxContent(props) {
              const _components = Object.assign({
                hr: \\"hr\\",
                h2: \\"h2\\",
                h1: \\"h1\\",
                p: \\"p\\"
              }, props.components);
              return _jsxs(_Fragment, {
                children: [_jsx(_components.hr, {}), \\"/n\\", _jsx(_components.h2, {
                  children: \\"title: Some Frontmatter Data\\"
                }), \\"/n\\", \\"/n\\", _jsx(_components.h1, {
                  children: \\"MDX test\\"
                }), \\"/n\\", _jsx(_components.p, {
                  children: \\"Does it parse and transform?\\"
                }), \\"/n\\", _jsx(Example, {})]
              });
            }
            function MDXContent(props = {}) {
              const {wrapper: MDXLayout} = props.components || ({});
              return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
                children: _jsx(_createMdxContent, props)
              })) : _createMdxContent(props);
            }
            export default MDXContent;
            "
          `)
  })

}
