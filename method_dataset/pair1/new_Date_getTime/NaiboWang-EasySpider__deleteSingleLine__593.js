const __obj__ = {
    deleteSingleLine: function (event) { //删除单行元素
      let at = new Date().getTime()
      //流程图送元素的时候，默认的使用不固定循环列表，但是一旦有删除元素的操作发生，则按照固定元素列表采集元素
      let index = event.target.getAttribute("index");
      let tnode = global.nodeList.splice(index, 1)[0]; //删掉当前元素
      tnode["node"].style.backgroundColor = tnode["bgColor"];
      tnode["node"].style.boxShadow = tnode["boxShadow"];
      if (global.nodeList.length > 1) { // 如果删到没有就没有其他的操作了
        handleElement();
        if (this.selectedDescendents) {
          handleDescendents(this.mode); //如果之前有选中子元素，新加入的节点又则这里也需要重新选择子元素
        }
      } else {
        this.valTable = [];
        this.selectStatus = false;
        clearParameters(); //直接撤销重选
      }
      let at2 = parseInt(new Date().getTime());
      console.log("delete:", at2, at, at2 - at);
    },

};
