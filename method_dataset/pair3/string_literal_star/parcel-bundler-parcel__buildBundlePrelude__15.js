function __method_wrapper__() {
  buildBundlePrelude(): [string, number] {
    let res = '';
    let lines = 0;
    for (let [source, specifiers] of this.packager.externals) {
      let defaultSpecifier = null;
      let namespaceSpecifier = null;
      let namedSpecifiers = [];
      for (let [imported, symbol] of specifiers) {
        if (imported === 'default' /* || isCommonJS*/) {
          defaultSpecifier = symbol;
        } else if (imported === '*') {
          namespaceSpecifier = `* as ${symbol}`;
        } else {
          let specifier = imported;
          if (!isValidIdentifier(specifier)) {
            specifier = JSON.stringify(specifier);
          }
          if (symbol !== imported) {
            specifier += ` as ${symbol}`;
          }

          namedSpecifiers.push(specifier);
        }
      }

      // ESModule syntax allows combining default and namespace specifiers, or default and named, but not all three.

      let imported = '';
      if (namespaceSpecifier) {
        let s = namespaceSpecifier;
        if (defaultSpecifier) {
          s = `${defaultSpecifier}, ${namespaceSpecifier}`;
        }

        res += `import ${s} from ${JSON.stringify(source)};\n`;
        lines++;
      } else if (defaultSpecifier) {
        imported = defaultSpecifier;
        if (namedSpecifiers.length > 0) {
          imported += `, {${namedSpecifiers.join(', ')}}`;
        }
      } else if (namedSpecifiers.length > 0) {
        imported = `{${namedSpecifiers.join(', ')}}`;
      }

      if (imported.length > 0) {
        res += `import ${imported} from ${JSON.stringify(source)};\n`;
        lines++;
      } else if (!namespaceSpecifier) {
        res += `import ${JSON.stringify(source)};\n`;
        lines++;
      }
    }

    if (res.length > 0) {
      res += '\n';
      lines++;
    }

    return [res, lines];
  }

}
