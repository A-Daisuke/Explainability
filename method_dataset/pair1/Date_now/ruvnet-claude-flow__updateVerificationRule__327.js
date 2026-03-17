function __method_wrapper__() {
    updateVerificationRule: async (parent, args, context) => {
      try {
        const rule = dataStore.rules.get(args.id);
        if (!rule) {
          throw new Error(`Rule ${args.id} not found`);
        }
        
        Object.assign(rule, args.input, {
          updatedAt: Date.now(),
        });
        
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
