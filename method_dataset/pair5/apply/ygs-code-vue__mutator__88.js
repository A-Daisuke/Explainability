                  function mutator() {
                      console.log('mutator')
                      var args = [], len = arguments.length;
                      while (len--) args[len] = arguments[len];

                      var result = original.apply(this, args);
                      var ob = this.__ob__;
                      console.log(this.__ob__)
                      debugger;
                      var inserted;
                      switch (method) {
                          case 'push':
                          case 'unshift':
                              inserted = args;
                              break
                          case 'splice':
                              inserted = args.slice(2);
                              break
                      }
                      if (inserted) {
                          ob.observeArray(inserted);
                      }
                      // notify change
                      ob.dep.notify();
                      return result
                  }
