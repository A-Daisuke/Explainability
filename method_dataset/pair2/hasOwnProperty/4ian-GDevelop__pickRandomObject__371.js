      export const pickRandomObject = function (
        instanceContainer: gdjs.RuntimeInstanceContainer,
        objectsLists: ObjectsLists
      ) {
        // Compute one many objects we have
        let objectsCount = 0;
        for (let listName in objectsLists.items) {
          if (objectsLists.items.hasOwnProperty(listName)) {
            let list = objectsLists.items[listName];
            objectsCount += list.length;
          }
        }
        if (objectsCount === 0) {
          return false;
        }

        // Pick one random object
        let index = Math.floor(Math.random() * objectsCount);
        if (index >= objectsCount) {
          index = objectsCount - 1;
        }

        //Should never happen.

        // Find the object
        let startIndex = 0;
        let theChosenOne: gdjs.RuntimeObject | null = null;
        for (let listName in objectsLists.items) {
          if (objectsLists.items.hasOwnProperty(listName)) {
            let list = objectsLists.items[listName];
            if (index - startIndex < list.length) {
              theChosenOne = list[index - startIndex];
              break;
            }
            startIndex += list.length;
          }
        }
        // @ts-ignore
        gdjs.evtTools.object.pickOnly(objectsLists, theChosenOne);
        return true;
      };
