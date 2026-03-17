      export const pickObjectsLinkedTo = function (
        instanceContainer: gdjs.RuntimeInstanceContainer,
        objectsLists: Hashtable<gdjs.RuntimeObject[]>,
        obj: gdjs.RuntimeObject | null,
        eventsFunctionContext: EventsFunctionContext | null | undefined
      ) {
        if (obj === null) {
          return false;
        }
        const linkedObjectMap =
          LinksManager.getManager(instanceContainer)._getMapOfObjectsLinkedWith(
            obj
          );

        let pickedSomething = false;
        for (const contextObjectName in objectsLists.items) {
          if (objectsLists.containsKey(contextObjectName)) {
            const parentEventPickedObjects =
              objectsLists.items[contextObjectName];

            if (parentEventPickedObjects.length === 0) {
              continue;
            }

            // Find the object names in the scene
            const parentEventPickedObjectNames = gdjs.staticArray2(
              gdjs.evtTools.linkedObjects.pickObjectsLinkedTo
            );
            parentEventPickedObjectNames.length = 0;
            if (eventsFunctionContext) {
              // For functions, objects lists may contain objects with different names
              // indexed not by their name, but by the parameter name representing them.
              // This means that each object can have a different name,
              // so we iterate on them to get all the names.
              for (const pickedObject of parentEventPickedObjects) {
                if (
                  parentEventPickedObjectNames.indexOf(pickedObject.getName()) <
                  0
                ) {
                  parentEventPickedObjectNames.push(pickedObject.getName());
                }
              }
            } else {
              // In the case of a scene, the list of objects are guaranteed
              // to be indexed by the object name (no mix of objects with
              // different names in a list).
              parentEventPickedObjectNames.push(contextObjectName);
            }

            // Sum the number of instances in the scene for each objects found
            // previously in parentEventPickedObjects, so that we know if we can
            // avoid running an intersection with the picked objects later.
            let objectCount = 0;
            for (const objectName of parentEventPickedObjectNames) {
              objectCount += instanceContainer.getObjects(objectName)!.length;
            }

            if (parentEventPickedObjects.length === objectCount) {
              // The parent event didn't make any selection on the current object,
              // (because the number of picked objects is the total object count on the scene).
              // There is no need to make an intersection.
              // We will only replace the picked list with the linked object list.
              parentEventPickedObjects.length = 0;
              for (const objectName of parentEventPickedObjectNames) {
                if (linkedObjectMap.has(objectName)) {
                  const linkedObjects = linkedObjectMap.get(objectName)!;

                  pickedSomething = pickedSomething || linkedObjects.length > 0;
                  parentEventPickedObjects.push.apply(
                    parentEventPickedObjects,
                    linkedObjects
                  );
                }
              }
            } else {
              // Run an intersection between objects picked by parent events
              // and the linked ones.
              const pickedAndLinkedObjects = gdjs.staticArray(
                gdjs.evtTools.linkedObjects.pickObjectsLinkedTo
              );
              pickedAndLinkedObjects.length = 0;

              for (const objectName of parentEventPickedObjectNames) {
                if (linkedObjectMap.has(objectName)) {
                  const linkedObjects = linkedObjectMap.get(objectName)!;

                  for (const otherObject of linkedObjects) {
                    if (parentEventPickedObjects.indexOf(otherObject) >= 0) {
                      pickedAndLinkedObjects.push(otherObject);
                    }
                  }
                }
              }
              pickedSomething =
                pickedSomething || pickedAndLinkedObjects.length > 0;
              parentEventPickedObjects.length = 0;
              parentEventPickedObjects.push.apply(
                parentEventPickedObjects,
                pickedAndLinkedObjects
              );
              pickedAndLinkedObjects.length = 0;
            }
            parentEventPickedObjectNames.length = 0;
          }
        }
        return pickedSomething;
      };
