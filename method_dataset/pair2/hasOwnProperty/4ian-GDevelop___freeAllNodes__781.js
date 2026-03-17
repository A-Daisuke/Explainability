function __method_wrapper__() {
      _freeAllNodes() {
        if (this._nodeCache.length <= 32000) {
          for (const i in this._allNodes) {
            if (this._allNodes.hasOwnProperty(i)) {
              const nodeArray = this._allNodes[i];
              for (const j in nodeArray) {
                if (nodeArray.hasOwnProperty(j)) {
                  this._nodeCache.push(nodeArray[j]);
                }
              }
            }
          }
        }
        this._allNodes = [];
      }

}
