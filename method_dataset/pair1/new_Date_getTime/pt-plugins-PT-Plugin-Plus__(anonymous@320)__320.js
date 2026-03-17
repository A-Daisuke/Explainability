function __method_wrapper__() {
    return new Promise<any>((resolve?: any, reject?: any) => {
      let saveData = Object.assign(
        {
          id: PPF.getNewId().substr(0, 8),
          update: new Date().getTime()
        },
        newItem
      );

      this.groups.push(saveData);
      this.storage.set(this.configKey, {
        groups: this.groups,
        items: this.items
      });
      resolve(this.groups);
    });

}
