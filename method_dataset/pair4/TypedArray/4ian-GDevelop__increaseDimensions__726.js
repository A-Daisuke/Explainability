class __C__ {
  increaseDimensions(
    columnsToAppend: number,
    columnsToUnshift: number,
    rowsToAppend: number,
    rowsToUnshift: number
  ) {
    const initialRowCount = this._tiles.length;
    const initialColumnCount = this._tiles[0].length;
    if (columnsToAppend > 0 || columnsToUnshift > 0) {
      this._tiles.forEach((row, rowIndex) => {
        const newRow = new Int32Array(
          initialColumnCount + columnsToAppend + columnsToUnshift
        ).fill(0);
        newRow.set(row, columnsToUnshift);
        this._tiles[rowIndex] = newRow;
      });
    }
    if (rowsToAppend > 0 || rowsToUnshift > 0) {
      // TODO: Consider over-provisioning columns and rows to avoid this operation being made
      // too often, especially in a case where tiles are added towards the outside.
      // Beware of over-provisioning rows above and/or columns on the left as it is supposed
      // to change the object position.
      this._tiles.unshift(
        ...new Array(rowsToUnshift)
          .fill(0)
          .map(() =>
            new Int32Array(
              initialColumnCount + columnsToAppend + columnsToUnshift
            ).fill(0)
          )
      );

      this._tiles.length = initialRowCount + rowsToAppend + rowsToUnshift;

      for (
        let rowIndex = initialRowCount + rowsToUnshift;
        rowIndex < this._tiles.length;
        rowIndex++
      ) {
        this._tiles[rowIndex] = new Int32Array(
          initialColumnCount + columnsToAppend + columnsToUnshift
        ).fill(0);
      }
    }
  }

}
