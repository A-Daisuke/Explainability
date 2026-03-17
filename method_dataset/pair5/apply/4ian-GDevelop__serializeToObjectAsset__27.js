export function serializeToObjectAsset(
  project: gdProject,
  object: gdObject,
  objectFullName: string,
  usedResourceNames: Array<string>
) {
  const usedResourceNamesVector = new gd.VectorString();
  const serializedElement = new gd.SerializerElement();
  gd.ObjectAssetSerializer.serializeTo(
    project,
    object,
    objectFullName,
    serializedElement,
    usedResourceNamesVector
  );
  usedResourceNames.push.apply(
    usedResourceNames,
    usedResourceNamesVector.toJSArray()
  );
  usedResourceNamesVector.delete();

  // JSON.parse + toJSON is 30% faster than gd.Serializer.toJSObject.
  const objectAsset = JSON.parse(gd.Serializer.toJSON(serializedElement));
  serializedElement.delete();

  return objectAsset;
}
