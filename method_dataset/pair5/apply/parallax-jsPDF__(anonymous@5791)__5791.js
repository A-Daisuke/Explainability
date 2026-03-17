function __method_wrapper__() {
        (function (events, newEvents) {
          // jsPDF.API.events is a JS Array of Arrays
          // where each Array is a pair of event name, handler
          // Events were added by plugins to the jsPDF instantiator.
          // These are always added to the new instance and some ran
          // during instantiation.
          var eventname, handler_and_args, i;
          for (i = newEvents.length - 1; i !== -1; i--) {
            // subscribe takes 3 args: 'topic', function, runonce_flag
            // if undefined, runonce is false.
            // users can attach callback directly,
            // or they can attach an array with [callback, runonce_flag]
            // that's what the "apply" magic is for below.
            eventname = newEvents[i][0];
            handler_and_args = newEvents[i][1];
            events.subscribe.apply(events, [eventname].concat(typeof handler_and_args === "function" ? [handler_and_args] : handler_and_args));
          }
        })(events, jsPDF.API.events);

}
