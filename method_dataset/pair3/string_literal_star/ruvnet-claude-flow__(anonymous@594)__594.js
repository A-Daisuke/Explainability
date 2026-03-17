function __method_wrapper__() {
      setTimeout(() => {
        if (envelope.to === '*') {
          // Broadcast to all agents
          this.state.agents.forEach((agent) => {
            this.emit(`deliver:${agent.id}`, envelope);
          });
        } else {
          // Direct delivery
          this.emit(`deliver:${envelope.to}`, envelope);
        }

        // Update message history
        const history = this.state.messageHistory.get(envelope.id);
        if (history) {
          history.status = 'sent';
          history.sentAt = Date.now();
        }
      }, Math.random() * 100);

}
