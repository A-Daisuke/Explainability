function __method_wrapper__() {
    test('tsc (isolated)', async () => {
      const tmp = tempdir()
      const t$ = $({ cwd: tmp, quiet: true })
      const zxdir = path.resolve(tmp, 'node_modules/zx')
      const pkgJson = {
        name: 'zx-test',
        dependencies: {
          typescript: '^5',
          '@types/node': '*',
          '@types/fs-extra': '*',
        },
      }

      await fs.outputJSON(path.resolve(tmp, 'package.json'), pkgJson)
      await t$`npm i`
      await sync(root, zxdir, ['package.json', 'build']) // `file:<path>` dep mounts `node_modules` too, so we use cloning here

      const tsconfig = {
        compilerOptions: {
          module: 'commonjs',
          target: 'esnext',
          outDir: 'bundle',
          rootDir: 'src',
          declaration: true,
          declarationMap: false,
          esModuleInterop: true,
        },
        include: ['src'],
      }
      const indexTs = `import {$} from 'zx'
(async () => {
  await $({verbose: true})\`echo hello\`
})()
`
      await fs.outputJSON(path.resolve(tmp, 'tsconfig.json'), tsconfig)
      await fs.outputFile(path.resolve(tmp, 'src/index.ts'), indexTs)

      await t$`tsc`
      const out = await t$`node bundle/index.js`.text()
      assert.strictEqual(out, '$ echo hello\nhello\n')
    })

}
