function __method_wrapper__() {
  private addAuditEntry(
    resource: CloudResource,
    userId: string,
    action: string,
    target: string,
    details: Record<string, any>,
  ): void {
    const entry: CloudAuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      action,
      resource: target,
      details,
    };

    resource.auditLog.push(entry);
  }

}
