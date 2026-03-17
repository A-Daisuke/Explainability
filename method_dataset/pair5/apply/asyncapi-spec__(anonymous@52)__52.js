function __method_wrapper__() {
  updates.forEach(update => {
    try {
      // Handle root document case
      if (update.json_pointer === '') {
        baseDoc = mergePatch.apply(baseDoc, update.example);
        return;
      }

      // For non-root cases, use jsonpointer to get and set the correct location
      const targetObject = jsonpointer.get(baseDoc, update.json_pointer);
      const updatedObject = mergePatch.apply(targetObject || {}, update.example);
      jsonpointer.set(baseDoc, update.json_pointer, updatedObject);

    } catch (e) {
      console.error(`\nError processing update for '${update.name}' at path '${update.json_pointer}'`, e);
      process.exit(1);
    }
  });

}
