async function run({input, api, farm, invalidateReason, options}) {
  report({
    type: 'buildProgress',
    phase: 'transforming',
    filePath: fromProjectPath(options.projectRoot, input.filePath),
  });

  api.invalidateOnFileUpdate(input.filePath);
  let start = Date.now();
  let {optionsRef, ...rest} = input;
  let {cachePath} = nullthrows(
    await api.runRequest<null, ConfigAndCachePath>(createParcelConfigRequest()),
  );

  let previousDevDepRequests: Map<string, DevDepRequestResult> = new Map(
    await Promise.all(
      api
        .getSubRequests()
        .filter(req => req.requestType === requestTypes.dev_dep_request)
        .map(async req => [
          req.id,
          nullthrows(await api.getRequestResult<DevDepRequestResult>(req.id)),
        ]),
    ),
  );

  let request: TransformationRequest = {
    ...rest,
    invalidateReason,
    devDeps: new Map(
      [...previousDevDepRequests.entries()]
        .filter(([id]) => api.canSkipSubrequest(id))
        .map(([, req]: [string, DevDepRequestResult]) => [
          `${req.specifier}:${fromProjectPathRelative(req.resolveFrom)}`,
          req.hash,
        ]),
    ),
    invalidDevDeps: await Promise.all(
      [...previousDevDepRequests.entries()]
        .filter(([id]) => !api.canSkipSubrequest(id))
        .flatMap(([, req]: [string, DevDepRequestResult]) => {
          return [
            {
              specifier: req.specifier,
              resolveFrom: req.resolveFrom,
            },
            ...(req.additionalInvalidations ?? []).map(i => ({
              specifier: i.specifier,
              resolveFrom: i.resolveFrom,
            })),
          ];
        }),
    ),
  };

  let {assets, configRequests, error, invalidations, devDepRequests} =
    (await farm.createHandle(
      'runTransform',
      input.isSingleChangeRebuild,
    )({
      configCachePath: cachePath,
      optionsRef,
      request,
    }): TransformationResult);

  let time = Date.now() - start;
  if (assets) {
    for (let asset of assets) {
      asset.stats.time = time;
    }
  }

  for (let filePath of invalidations.invalidateOnFileChange) {
    api.invalidateOnFileUpdate(filePath);
    api.invalidateOnFileDelete(filePath);
  }

  for (let invalidation of invalidations.invalidateOnFileCreate) {
    api.invalidateOnFileCreate(invalidation);
  }

  for (let env of invalidations.invalidateOnEnvChange) {
    api.invalidateOnEnvChange(env);
  }

  for (let option of invalidations.invalidateOnOptionChange) {
    api.invalidateOnOptionChange(option);
  }

  if (invalidations.invalidateOnStartup) {
    api.invalidateOnStartup();
  }

  if (invalidations.invalidateOnBuild) {
    api.invalidateOnBuild();
  }

  for (let devDepRequest of devDepRequests) {
    await runDevDepRequest(api, devDepRequest);
  }

  for (let configRequest of configRequests) {
    await runConfigRequest(api, configRequest);
  }

  if (error != null) {
    throw new ThrowableDiagnostic({diagnostic: error});
  } else {
    return nullthrows(assets);
  }
}
