function __method_wrapper__() {
  private addAuditEntry(
    deployment: Deployment,
    userId: string,
    action: string,
    target: string,
    details: Record<string, any>,
  ): void {
    const entry: DeploymentAuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      action,
      target,
      details,
    };

    deployment.auditLog.push(entry);
  }

}
