function __method_wrapper__() {
    droper.on("drop", (e: any) => {
      console.log(e);
      e.stopPropagation();
      e.preventDefault();
      this.hideDroper();

      // 获取未处理的地址
      try {
        let data = JSON.parse(
          e.originalEvent.dataTransfer.getData("text/plain")
        );
        if (data && data.url) {
          onDrop.call(this, data, e, onSuccess, onError);
        }
      } catch (error) {
        // 错误时，尝试直接使用文本内容
        let data = e.originalEvent.dataTransfer.getData("text/plain");
        if (data) {
          data = {
            url: data
          };

          onDrop.call(this, data, e, onSuccess, onError);
        }
      }
    });

}
