function __method_wrapper__() {
  public add(data: LogItem): string {
    let time: number = new Date().getTime();
    let saveData: LogItem = Object.assign(
      {
        module: "",
        time,
        id: PPF.getNewId()
      },
      data
    );
    if (!this.items) {
      this.load().then(() => {
        this.items.push(saveData);
        this.storage.set(this.configKey, this.items);
      });
    } else {
      // 如果超出了最大值，则删除最早的记录
      if (this.items.length >= this.maxLength) {
        this.items.splice(0, 1);
      }
      this.items.push(saveData);
      this.storage.set(this.configKey, this.items);
    }
    return saveData.id as string;
  }

}
