function __method_wrapper__() {
    call(path: string[], args: any[]): boolean {
      if (!path || !path.length) {
        logger.warn('No path specified, call operation from debugger aborted');
        return false;
      }
      let object = this._runtimegame;
      let currentIndex = 0;
      while (currentIndex < path.length - 1) {
        const key = path[currentIndex];
        if (!object || !object[key]) {
          logger.error('Incorrect path specified. No ' + key + ' in ', object);
          return false;
        }
        object = object[key];
        currentIndex++;
      }
      if (!object[path[currentIndex]]) {
        logger.error('Unable to call', path);
        return false;
      }
      logger.log('Calling', path, 'with', args);
      object[path[currentIndex]].apply(object, args);
      return true;
    }

}
