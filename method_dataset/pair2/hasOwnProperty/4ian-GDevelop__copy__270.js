class __C__ {
  static copy(source, target, merge) {
    if (!merge) target.clearChildren();
    target.castTo(source.getType());
    if (source.isPrimitive()) {
      target.setValue(source.getValue());
    } else if (source.getType() === 'structure') {
      const children = source.getAllChildren();
      for (const p in children) {
        if (children.hasOwnProperty(p)) target.addChild(p, children[p].clone());
      }
    } else if (source.getType() === 'array') {
      for (const p of source.getAllChildrenArray()) target.pushVariableCopy(p);
    }
    return target;
  }

}
