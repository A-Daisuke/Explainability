const __obj__ = {
    createTransitions: function (o) {
      var pattern, state;
      /** @type {string[]} */
      var stateArray;
      var i;
      //
      // 1. Collect all states
      //
      /** @type {Transitions} */
      var transitions = {};
      for (pattern in o) {
        for (state in o[pattern]) {
          stateArray = state.split("|");
          o[pattern][state].stateArray = stateArray;
          for (i=0; i<stateArray.length; i++) {
            transitions[stateArray[i]] = [];
          }
        }
      }
      //
      // 2. Fill states
      //
      for (pattern in o) {
        for (state in o[pattern]) {
          stateArray = o[pattern][state].stateArray || [];
          for (i=0; i<stateArray.length; i++) {
            //
            // 2a. Normalize actions into array:  'text=' ==> [{type_:'text='}]
            // (Note to myself: Resolving the function here would be problematic. It would need .bind (for *this*) and currying (for *option*).)
            //
            /** @type {any} */
            var p = o[pattern][state];
            if (p.action_) {
              p.action_ = [].concat(p.action_);
              for (var k=0; k<p.action_.length; k++) {
                if (typeof p.action_[k] === "string") {
                  p.action_[k] = { type_: p.action_[k] };
                }
              }
            } else {
              p.action_ = [];
            }
            //
            // 2.b Multi-insert
            //
            var patternArray = pattern.split("|");
            for (var j=0; j<patternArray.length; j++) {
              if (stateArray[i] === '*') {  // insert into all
                for (var t in transitions) {
                  transitions[t].push({ pattern: patternArray[j], task: p });
                }
              } else {
                transitions[stateArray[i]].push({ pattern: patternArray[j], task: p });
              }
            }
          }
        }
      }
      return transitions;
    },

};
