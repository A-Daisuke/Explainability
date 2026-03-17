  function matchPathPattern(pattern, input) {
    if (pattern.includes('*')) {
      const escapedPattern = pattern.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regexPattern = escapedPattern.replace(/\\\*/g, '.*');
      debug('depcheck:applyImportsMap:matchPathPattern:regexPattern')(
        pattern,
        input,
        regexPattern,
      );
      const regex = new RegExp(`^${regexPattern}$`);
      const match = input.match(regex);
      if (match) {
        return match[0];
      }
    } else if (pattern === input) {
      return '';
    }
    return null;
  }
