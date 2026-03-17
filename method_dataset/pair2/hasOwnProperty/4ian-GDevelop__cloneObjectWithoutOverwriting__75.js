  const cloneObjectWithoutOverwriting = ({
    target,
    source,
  }: {
    target: Object;
    source: Object;
  }) => {
    // Add the new properties.
    for (const key in source) {
      if (source.hasOwnProperty(key) && !target.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }

    // Remove the properties that are not in the source.
    for (const key in target) {
      if (target.hasOwnProperty(key) && !source.hasOwnProperty(key)) {
        delete target[key];
      }
    }
  };
