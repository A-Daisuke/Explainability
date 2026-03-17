function __method_wrapper__() {
  CodeMirror.simpleMode = function(config, states) {
    ensureState(states, "start");
    var states_ = {}, meta = states.meta || {}, hasIndentation = false;
    for (var state in states) if (state != meta && states.hasOwnProperty(state)) {
      var list = states_[state] = [], orig = states[state];
      for (var i = 0; i < orig.length; i++) {
        var data = orig[i];
        list.push(new Rule(data, states));
        if (data.indent || data.dedent) hasIndentation = true;
      }
    }
    var mode = {
      startState: function() {
        return {state: "start", pending: null,
                local: null, localState: null,
                indent: hasIndentation ? [] : null};
      },
      copyState: function(state) {
        var s = {state: state.state, pending: state.pending,
                 local: state.local, localState: null,
                 indent: state.indent && state.indent.slice(0)};
        if (state.localState)
          s.localState = CodeMirror.copyState(state.local.mode, state.localState);
        if (state.stack)
          s.stack = state.stack.slice(0);
        for (var pers = state.persistentStates; pers; pers = pers.next)
          s.persistentStates = {mode: pers.mode,
                                spec: pers.spec,
                                state: pers.state == state.localState ? s.localState : CodeMirror.copyState(pers.mode, pers.state),
                                next: s.persistentStates};
        return s;
      },
      token: tokenFunction(states_, config),
      innerMode: function(state) { return state.local && {mode: state.local.mode, state: state.localState}; },
      indent: indentFunction(states_, meta)
    };
    if (meta) for (var prop in meta) if (meta.hasOwnProperty(prop))
      mode[prop] = meta[prop];
    return mode;
  };

}
