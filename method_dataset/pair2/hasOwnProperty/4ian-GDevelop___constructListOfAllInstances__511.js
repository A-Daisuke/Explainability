function __method_wrapper__() {
    private _constructListOfAllInstances() {
      let currentListSize = 0;
      for (const name in this._instances.items) {
        if (this._instances.items.hasOwnProperty(name)) {
          const list = this._instances.items[name];
          const oldSize = currentListSize;
          currentListSize += list.length;
          for (let j = 0, lenj = list.length; j < lenj; ++j) {
            if (oldSize + j < this._allInstancesList.length) {
              this._allInstancesList[oldSize + j] = list[j];
            } else {
              this._allInstancesList.push(list[j]);
            }
          }
        }
      }
      this._allInstancesList.length = currentListSize;
      this._allInstancesListIsUpToDate = true;
    }

}
