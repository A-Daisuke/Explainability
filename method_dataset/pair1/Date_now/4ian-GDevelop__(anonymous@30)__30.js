function __method_wrapper__() {
(async () => {
  // Generate the output file paths
  const {
    allGDJSInOutFilePaths,
    allExtensionsInOutFilePaths,
  } = await getAllInOutFilePaths({ bundledOutPath });

  // Build (or copy) all the files
  let errored = false;
  const startTime = Date.now();
  await Promise.all(
    [...allGDJSInOutFilePaths, ...allExtensionsInOutFilePaths].map(
      async ({ inPath, outPath }) => {
        if (isUntransformedFile(inPath)) {
          try {
            await fs.mkdir(path.dirname(outPath), { recursive: true });
            await fs.copyFile(inPath, outPath);
          } catch (err) {
            shell.echo(`❌ Error while copying "${inPath}":` + err);
            errored = true;
          }
          return;
        }

        return build({
          sourcemap: true,
          entryPoints: [inPath],
          minify: !args.debug,
          outfile: renameBuiltFile(outPath),
        }).catch(() => {
          // Error is already logged by esbuild.
          errored = true;
        });
      }
    )
  );

  const buildDuration = Date.now() - startTime;
  if (!errored) shell.echo(`✅ GDJS built in ${buildDuration}ms`);
  if (errored) shell.exit(1);
})();

}
