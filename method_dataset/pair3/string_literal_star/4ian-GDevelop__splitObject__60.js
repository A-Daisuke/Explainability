  const splitObject = (
    currentObject: Object,
    currentPath: string,
    currentReference: string
  ) => {
    if (currentObject !== null && typeof currentObject === 'object') {
      if (Array.isArray(currentObject)) {
        for (let index in currentObject) {
          const itemPath = currentPath + pathSeparator + '*';
          if (shouldSplit(itemPath)) {
            const partialObject = currentObject[index];
            const name = getArrayItemReferenceName(
              partialObject,
              currentReference
            );
            const itemReference = currentReference + pathSeparator + name;

            currentObject[index] = createReference(
              itemReference,
              partialObject
            );

            splitObject(partialObject, itemPath, itemReference);
          } else {
            const itemReference = currentReference + pathSeparator + index;

            splitObject(currentObject[index], itemPath, itemReference);
          }
        }
      } else {
        for (let propertyName in currentObject) {
          const propertyPath = currentPath + pathSeparator + propertyName;
          const propertyReference =
            currentReference + pathSeparator + propertyName;
          if (shouldSplit(propertyPath)) {
            const partialObject = currentObject[propertyName];

            currentObject[propertyName] = createReference(
              propertyReference,
              partialObject
            );

            splitObject(partialObject, propertyPath, propertyReference);
          } else {
            splitObject(
              currentObject[propertyName],
              propertyPath,
              propertyReference
            );
          }
        }
      }
    }
  };
