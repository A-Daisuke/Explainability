function __method_wrapper__() {
    cancelVerification: async (parent, args, context) => {
      try {
        const verification = dataStore.verifications.get(args.id);
        if (!verification) {
          throw new Error(`Verification ${args.id} not found`);
        }
        
        if (verification.status !== 'PENDING') {
          throw new Error('Can only cancel pending verifications');
        }
        
        verification.status = 'CANCELLED';
        verification.updatedAt = Date.now();
        verification.completedAt = Date.now();
        
        return {
          success: true,
          verification,
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    },

}
