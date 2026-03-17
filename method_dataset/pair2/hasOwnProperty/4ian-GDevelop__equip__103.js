class __C__ {
    equip(itemName, equip) {
      if (!this._items.hasOwnProperty(itemName)) {
        return false;
      }
      const item = this._items[itemName];
      if (!equip) {
        item.equipped = false;
        return true;
      } else {
        if (item.count > 0) {
          item.equipped = true;
          return true;
        }
      }
      return false;
    }

}
