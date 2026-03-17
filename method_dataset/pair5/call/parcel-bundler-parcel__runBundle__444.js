export async function runBundle(
  bundleGraph: BundleGraph<PackagedBundle>,
  bundle: PackagedBundle,
  globals: mixed,
  opts: RunOpts = {},
  externalModules?: ExternalModules,
): Promise<mixed> {
  if (bundle.type === 'html') {
    let code = await overlayFS.readFile(nullthrows(bundle.filePath), 'utf8');
    let ast = postHtmlParse(code, {
      lowerCaseAttributeNames: true,
    });

    let bundles = bundleGraph.getBundles({includeInline: true});
    let scripts = [];
    let importMap: ?ImportMap = null;
    postHtml().walk.call(ast, node => {
      if (node.attrs?.nomodule != null) {
        return node;
      }
      if (node.tag === 'script' && node.attrs?.src) {
        let src = url.parse(nullthrows(node.attrs).src);
        if (src.hostname == null) {
          let p = path.join(distDir, nullthrows(src.pathname));
          let b = nullthrows(bundles.find(b => b.filePath === p));
          scripts.push([overlayFS.readFileSync(b.filePath, 'utf8'), b]);
        }
      } else if (
        node.tag === 'script' &&
        node.content &&
        node.attrs?.type === 'importmap'
      ) {
        importMap = JSON.parse(node.content.join(''));
      } else if (node.tag === 'script' && node.content && !node.attrs?.src) {
        let content = node.content.join('');
        let inline = bundles.filter(
          b => b.bundleBehavior === 'inline' && b.type === 'js',
        );
        scripts.push([content, inline[0]]);
      }
      return node;
    });

    return runBundles(
      bundleGraph,
      bundle,
      scripts,
      globals,
      opts,
      externalModules,
      importMap,
    );
  } else {
    return runBundles(
      bundleGraph,
      bundle,
      [[overlayFS.readFileSync(bundle.filePath, 'utf8'), bundle]],
      globals,
      opts,
      externalModules,
    );
  }
}
