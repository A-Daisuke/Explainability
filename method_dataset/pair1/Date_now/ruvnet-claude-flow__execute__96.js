function __method_wrapper__() {
        execute: async ({ sessionId, data = {} }) => {
          if (sessions.has(sessionId)) {
            return { error: 'Session already exists' };
          }

          sessions.set(sessionId, {
            data,
            created: Date.now(),
          });

          return {
            success: true,
            sessionId,
            created: sessions.get(sessionId)!.created,
          };
        },

}
