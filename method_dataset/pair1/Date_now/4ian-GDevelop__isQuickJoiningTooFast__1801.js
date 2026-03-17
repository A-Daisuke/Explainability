    const isQuickJoiningTooFast = () => {
      const requestDoneAt = Date.now();
      if (_lastQuickJoinRequestDoneAt) {
        if (requestDoneAt - _lastQuickJoinRequestDoneAt < 500) {
          _lastQuickJoinRequestDoneAt = requestDoneAt;
          logger.warn(
            'Last request to quick join a lobby was sent too little time ago. Ignoring this one.'
          );
          return true;
        }
      } else {
        _lastQuickJoinRequestDoneAt = requestDoneAt;
      }

      return false;
    };
