  function adaptClassMethods(object) {
    var proto = object.prototype;
    for (var method in proto) {
      if (method && proto.hasOwnProperty(method)) {
        var newName = method;
        var addToModule = false;
        var addToObject = false;

        //Detect static methods
        if (method.indexOf('STATIC_') === 0) {
          newName = removePrefix(newName, 'STATIC_');
          addToObject = true;
        }

        //Detect free functions
        if (method.indexOf('FREE_') === 0) {
          newName = removePrefix(newName, 'FREE_');
          addToModule = true;
        }

        //Remove prefix used for custom code generation
        newName = removePrefix(newName, 'MAP_');
        newName = removePrefix(newName, 'WRAPPED_');
        if (newName.indexOf('CLONE_') === 0) {
          newName = 'clone';
        }

        //Normalize method name
        newName = uncapitalizeFirstLetter(newName);
        if (newName !== method) {
          proto[newName] = proto[method];
          delete proto[method];
        }

        if (addToObject) {
          object[newName] = proto[newName];
        }

        if (addToModule) {
          gd[newName] = (function (fct) {
            return function () {
              //Simulate a free function
              if (arguments.length === 0) return fct();
              var args = [];
              Array.prototype.push.apply(args, arguments);
              args.shift();

              return fct.apply(arguments[0], args);
            };
          })(proto[newName]);
        }
      }
    }

    //Offer a delete method that does what gd.destroy does.
    proto.delete = function () {
      gd.destroy(this);
    };
  }
