function __method_wrapper__() {
      sendMessage(to: string, type: string, content: any) {
        const message: AgentMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          from: this.id,
          to,
          type,
          content,
          timestamp: Date.now(),
          hash: generateMessageHash(content)
        };
        
        communicationBus.emit(`message:${to}`, message);
        communicationBus.emit('message:sent', message);
        return message;
      },

}
