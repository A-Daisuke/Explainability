      export const pickOnly = function (
        objectsLists: ObjectsLists,
        runtimeObject: gdjs.RuntimeObject
      ) {
        for (const listName in objectsLists.items) {
          if (objectsLists.items.hasOwnProperty(listName)) {
            const list = objectsLists.items[listName];

            //Be sure not to lose the reference to the original array
            if (list.indexOf(runtimeObject) === -1) {
              list.length = 0;
            } else {
              list.length = 0;

              //Be sure not to lose the reference to the original array
              list.push(runtimeObject);
            }
          }
        }
      };
