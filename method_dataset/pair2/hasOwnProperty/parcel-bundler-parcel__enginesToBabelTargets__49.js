export function enginesToBabelTargets(env: Environment): BabelTargets {
  // "Targets" is the name @babel/preset-env uses for what Parcel calls engines.
  // This should not be confused with Parcel's own targets.
  // Unlike Parcel's engines, @babel/preset-env expects to work with minimum
  // versions, not semver ranges, of its targets.
  let targets = {};
  for (let engineName of Object.keys(env.engines)) {
    let engineValue = env.engines[engineName];

    // if the engineValue is a string, it might be a semver range. Use the minimum
    // possible version instead.
    if (engineName === 'browsers') {
      targets[engineName] = engineValue;
    } else {
      invariant(typeof engineValue === 'string');
      if (!TargetNames.hasOwnProperty(engineName)) continue;
      let minVersion = semver.minVersion(engineValue)?.toString();
      targets[engineName] = minVersion ?? engineValue;
    }
  }

  if (env.outputFormat === 'esmodule' && env.isBrowser()) {
    // If there is already a browsers target, add a blacklist to exclude
    // instead of using babel's esmodules target. This allows specifying
    // a newer set of browsers than the baseline esmodule support list.
    // See https://github.com/babel/babel/issues/8809.
    if (targets.browsers) {
      let browsers = Array.isArray(targets.browsers)
        ? targets.browsers
        : [targets.browsers];
      targets.browsers = [...browsers, ...ESMODULE_BROWSERS];
    } else {
      targets.esmodules = true;
    }
  }

  return targets;
}
