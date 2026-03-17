function __method_wrapper__() {
    createVerificationRule: async (parent, args, context) => {
      try {
        const rule = {
          id: nanoid(),
          ...args.input,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          executionCount: 0,
          successCount: 0,
        };
        
        dataStore.rules.set(rule.id, rule);
        
        return {
          success: true,
          rule,
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    },

}
