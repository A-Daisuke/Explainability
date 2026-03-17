function __method_wrapper__() {
  this.publish = function(topic) {
    if (topics.hasOwnProperty(topic)) {
      var args = Array.prototype.slice.call(arguments, 1),
        tokens = [];

      for (var token in topics[topic]) {
        var sub = topics[topic][token];
        try {
          sub[0].apply(context, args);
        } catch (ex) {
          if (globalObject.console) {
            console.error("jsPDF PubSub Error", ex.message, ex);
          }
        }
        if (sub[1]) tokens.push(token);
      }
      if (tokens.length) tokens.forEach(this.unsubscribe);
    }
  };

}
