function __method_wrapper__() {
  API.advancedAPI = function(body) {
    var doSwitch = apiMode === ApiMode.COMPAT;

    if (doSwitch) {
      advancedAPI.call(this);
    }

    if (typeof body !== "function") {
      return this;
    }

    body(this);

    if (doSwitch) {
      compatAPI.call(this);
    }

    return this;
  };

}
