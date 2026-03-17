function __method_wrapper__() {
  public add(
    data: any,
    host: string = "",
    clientId: string = "",
    success: boolean = true
  ) {
    let saveData = {
      data,
      clientId,
      host,
      success,
      time: new Date().getTime()
    };
    if (!this.items) {
      this.load().then(() => {
        this.items.push(saveData);
        this.updateData();
      });
    } else {
      let index = this.items.findIndex((item: any) => {
        return item.data.url === data.url;
      });
      if (index === -1) {
        this.items.push(saveData);
        this.updateData();
      }
    }
  }

}
