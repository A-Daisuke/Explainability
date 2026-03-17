function __method_wrapper__() {
      _getNode(xPos: integer, yPos: integer): Node {
        //First check if their is a node a the specified position.
        if (this._allNodes.hasOwnProperty(xPos)) {
          if (this._allNodes[xPos].hasOwnProperty(yPos)) {
            return this._allNodes[xPos][yPos];
          }
        } else {
          this._allNodes[xPos] = [];
        }

        //No so construct a new node (or get it from the cache)...
        let newNode: Node;
        if (this._nodeCache.length !== 0) {
          newNode = this._nodeCache.shift()!;
          newNode.reinitialize(xPos, yPos);
        } else {
          newNode = new Node(xPos, yPos);
        }

        const nodeCenterX = xPos * this._cellWidth + this._gridOffsetX;
        const nodeCenterY = yPos * this._cellHeight + this._gridOffsetY;

        //...and update its cost according to obstacles
        let objectsOnCell = false;
        const radius =
          this._cellHeight > this._cellWidth
            ? this._cellHeight * 2
            : this._cellWidth * 2;
        this._obstacles.getAllObstaclesAround(
          nodeCenterX,
          nodeCenterY,
          radius,
          this._closeObstacles
        );
        for (let k = 0; k < this._closeObstacles.length; ++k) {
          const obj = this._closeObstacles[k].owner;
          const topLeftCellX = Math.floor(
            (obj.getDrawableX() - this._rightBorder - this._gridOffsetX) /
              this._cellWidth
          );
          const topLeftCellY = Math.floor(
            (obj.getDrawableY() - this._bottomBorder - this._gridOffsetY) /
              this._cellHeight
          );
          const bottomRightCellX = Math.ceil(
            (obj.getDrawableX() +
              obj.getWidth() +
              this._leftBorder -
              this._gridOffsetX) /
              this._cellWidth
          );
          const bottomRightCellY = Math.ceil(
            (obj.getDrawableY() +
              obj.getHeight() +
              this._topBorder -
              this._gridOffsetY) /
              this._cellHeight
          );
          if (
            topLeftCellX < xPos &&
            xPos < bottomRightCellX &&
            topLeftCellY < yPos &&
            yPos < bottomRightCellY
          ) {
            objectsOnCell = true;
            if (this._closeObstacles[k].isImpassable()) {
              //The cell is impassable, stop here.
              newNode.cost = -1;
              break;
            } else {
              //Superimpose obstacles
              newNode.cost += this._closeObstacles[k].getCost();
            }
          }
        }
        if (!objectsOnCell) {
          newNode.cost = 1;
        }

        //Default cost when no objects put on the cell.
        this._allNodes[xPos][yPos] = newNode;
        return newNode;
      }

}
