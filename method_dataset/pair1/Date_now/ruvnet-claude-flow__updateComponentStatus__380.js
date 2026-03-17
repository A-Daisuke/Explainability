function __method_wrapper__() {
  private updateComponentStatus(
    component: string,
    status: 'healthy' | 'unhealthy' | 'warning',
    message?: string,
  ): void {
    const statusInfo: ComponentStatus = {
      component,
      status,
      message: message || '',
      timestamp: Date.now(),
      lastHealthCheck: Date.now(),
    };

    this.componentStatuses.set(component, statusInfo);

    // Emit status update
    this.eventBus.emit('component:status:updated', statusInfo);
  }

}
