export async function init(config, vm) {
  const isAuto = config.paths === 'auto';
  const paths = isAuto ? getAllPaths(vm.router) : config.paths;

  let namespaceSuffix = '';

  // only in auto mode
  if (paths.length && isAuto && config.pathNamespaces) {
    const path = paths[0];

    if (Array.isArray(config.pathNamespaces)) {
      namespaceSuffix =
        config.pathNamespaces.filter(
          prefix => path.slice(0, prefix.length) === prefix,
        )[0] || namespaceSuffix;
    } else if (config.pathNamespaces instanceof RegExp) {
      const matches = path.match(config.pathNamespaces);

      if (matches) {
        namespaceSuffix = matches[0];
      }
    }
    const isExistHome = paths.indexOf(namespaceSuffix + '/') === -1;
    const isExistReadme = paths.indexOf(namespaceSuffix + '/README') === -1;
    if (isExistHome && isExistReadme) {
      paths.unshift(namespaceSuffix + '/');
    }
  } else if (paths.indexOf('/') === -1 && paths.indexOf('/README') === -1) {
    paths.unshift('/');
  }

  const expireKey = resolveExpireKey(config.namespace) + namespaceSuffix;
  const indexKey = resolveIndexKey(config.namespace) + namespaceSuffix;

  const isExpired = (await getData(expireKey, true)) < Date.now();

  INDEXES = await getData(indexKey);

  if (isExpired) {
    INDEXES = [];
  } else if (!isAuto) {
    return;
  }

  const len = paths.length;
  let count = 0;

  paths.forEach(path => {
    const pathExists = Array.isArray(INDEXES)
      ? INDEXES.some(obj => obj.path === path)
      : false;
    if (pathExists) {
      return count++;
    }

    Docsify.get(vm.router.getFile(path), false, vm.config.requestHeaders).then(
      async result => {
        INDEXES[path] = genIndex(
          path,
          result,
          vm.router,
          config.depth,
          indexKey,
        );
        if (len === ++count) {
          await saveData(config.maxAge, expireKey);
        }
      },
    );
  });
}
