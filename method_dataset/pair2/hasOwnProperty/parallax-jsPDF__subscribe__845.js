function __method_wrapper__() {
  this.subscribe = function(topic, callback, once) {
    once = once || false;
    if (
      typeof topic !== "string" ||
      typeof callback !== "function" ||
      typeof once !== "boolean"
    ) {
      throw new Error(
        "Invalid arguments passed to PubSub.subscribe (jsPDF-module)"
      );
    }

    if (!topics.hasOwnProperty(topic)) {
      topics[topic] = {};
    }

    var token = Math.random().toString(35);
    topics[topic][token] = [callback, !!once];

    return token;
  };

}
