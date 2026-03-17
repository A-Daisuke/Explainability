function __method_wrapper__() {
    fromJSObject(obj: any): this {
      if (obj === null) {
        this.setString('null');
      } else if (typeof obj === 'number') {
        if (Number.isNaN(obj)) {
          logger.warn('Variables cannot be set to NaN, setting it to 0.');
          this.setNumber(0);
        } else {
          this.setNumber(obj);
        }
      } else if (typeof obj === 'string') {
        this.setString(obj);
      } else if (typeof obj === 'undefined') {
        // Do not modify the variable, as there is no value to set it to.
      } else if (typeof obj === 'boolean') {
        this.setBoolean(obj);
      } else if (Array.isArray(obj)) {
        this.castTo('array');
        this.clearChildren();
        for (const i in obj) this.getChild(i).fromJSObject(obj[i]);
      } else if (typeof obj === 'object') {
        this.castTo('structure');
        this.clearChildren();
        for (var p in obj)
          if (obj.hasOwnProperty(p)) this.getChild(p).fromJSObject(obj[p]);
      } else if (typeof obj === 'symbol') {
        this.setString(obj.toString());
      } else if (typeof obj === 'bigint') {
        if (obj > Number.MAX_SAFE_INTEGER)
          logger.warn(
            'Error while converting JS variable to GDevelop variable: Integers bigger than ' +
              Number.MAX_SAFE_INTEGER +
              " aren't supported by GDevelop variables, it will be reduced to that size."
          );
        // @ts-ignore
        this.setNumber(parseInt(obj, 10));
      } else if (typeof obj === 'function') {
        logger.error(
          'Error while converting JS variable to GDevelop variable: Impossible to set variable value to a function.'
        );
      } else {
        logger.error(
          'Error while converting JS variable to GDevelop variable: Cannot identify type of object ' +
            obj
        );
      }
      return this;
    }

}
