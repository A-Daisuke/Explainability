class __C__ {
    async activate() {
      const {
        createWebhook,
        http: { endpoint: hookUrl },
        vaultId,
        getTriggerContext,
        getTriggerName,
        setTriggerContextId,
      } = this;

      const triggerContextId = Date.now();

      await createWebhook({
        data: {
          hookUrl,
          vault_id: vaultId,
          trigger_name: getTriggerName(),
          trigger_context: getTriggerContext(),
          trigger_context_id: triggerContextId,
        },
      });

      setTriggerContextId(triggerContextId);
    },

}
