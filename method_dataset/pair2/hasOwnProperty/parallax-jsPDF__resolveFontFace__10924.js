function resolveFontFace(fontFaceMap, rules, opts) {
  opts = opts || {};
  var defaultFontFamily = opts.defaultFontFamily || "times";
  var genericFontFamilies = Object.assign({}, defaultGenericFontFamilies, opts.genericFontFamilies || {});
  var rule = null;
  var matches = null;
  for (var i = 0; i < rules.length; ++i) {
    rule = normalizeFontFace(rules[i]);
    if (genericFontFamilies[rule.family]) {
      rule.family = genericFontFamilies[rule.family];
    }
    if (fontFaceMap.hasOwnProperty(rule.family)) {
      matches = fontFaceMap[rule.family];
      break;
    }
  }

  // Always fallback to a known font family.
  matches = matches || fontFaceMap[defaultFontFamily];
  if (!matches) {
    // At this point we should definitiely have a font family, but if we
    // don't there is something wrong with our configuration
    throw new Error("Could not find a font-family for the rule '" + ruleToString(rule) + "' and default family '" + defaultFontFamily + "'.");
  }
  matches = resolveFontStretch(rule.stretch, matches);
  matches = resolveFontStyle(rule.style, matches);
  matches = resolveFontWeight(rule.weight, matches);
  if (!matches) {
    // We should've fount
    throw new Error("Failed to resolve a font for the rule '" + ruleToString(rule) + "'.");
  }
  return matches;
}
