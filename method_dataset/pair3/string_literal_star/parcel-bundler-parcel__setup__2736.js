function __method_wrapper__() {
        async setup() {
          let pkgFile = path.join(inputDir, 'package.json');
          let pkg = JSON.parse(await overlayFS.readFile(pkgFile));
          await overlayFS.writeFile(
            pkgFile,
            JSON.stringify({
              ...pkg,
              dependencies: {
                react: '*',
              },
            }),
          );

          await overlayFS.writeFile(
            path.join(inputDir, 'src/index.js'),
            `import React from 'react';

            export function Component() {
              return <h1>Hello world</h1>;
            }`,
          );
        },

}
