function __method_wrapper__() {
  this.sortAndGetOrderedItems = function () {
    isVisitedNode = Object.create(null)
    finishTimeCount = 0
    finishingTimeList = []

    for (const node in graph) {
      if (
        Object.prototype.hasOwnProperty.call(graph, node) &&
        !isVisitedNode[node]
      ) {
        dfsTraverse(node)
      }
    }

    finishingTimeList.sort(function (item1, item2) {
      return item1.finishTime > item2.finishTime ? -1 : 1
    })

    return finishingTimeList.map(function (value) {
      return value.node
    })
  }

}
