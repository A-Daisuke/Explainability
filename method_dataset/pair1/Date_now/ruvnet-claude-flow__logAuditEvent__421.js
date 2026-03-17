function __method_wrapper__() {
  async logAuditEvent(eventData: {
    eventType: string;
    category: AuditEntry['category'];
    severity?: AuditEntry['severity'];
    userId?: string;
    sessionId?: string;
    resource: AuditEntry['resource'];
    action: string;
    outcome: AuditEntry['outcome'];
    details: Record<string, any>;
    context: Partial<AuditEntry['context']>;
    compliance?: {
      frameworks?: string[];
      controls?: string[];
      classification?: AuditEntry['compliance']['classification'];
    };
  }): Promise<AuditEntry> {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      eventType: eventData.eventType,
      category: eventData.category,
      severity: eventData.severity || 'medium',
      userId: eventData.userId,
      sessionId: eventData.sessionId,
      resource: eventData.resource,
      action: eventData.action,
      outcome: eventData.outcome,
      details: eventData.details,
      context: {
        source: 'system',
        ...eventData.context,
      },
      compliance: {
        frameworks: eventData.compliance?.frameworks || [],
        controls: eventData.compliance?.controls || [],
        retention: this.calculateRetentionPeriod(
          eventData.category,
          eventData.compliance?.frameworks,
        ),
        classification: eventData.compliance?.classification || 'internal',
      },
      integrity: {
        hash: '',
        verified: false,
      },
      metadata: {},
    };

    // Calculate integrity hash
    entry.integrity.hash = this.calculateHash(entry);
    entry.integrity.verified = true;

    // Add to buffer for batch processing
    this.auditBuffer.push(entry);

    // Immediate processing for critical events
    if (entry.severity === 'critical') {
      await this.processAuditEntry(entry);
      await this.generateSecurityAlert(entry);
    }

    // Batch process if buffer is full
    if (this.auditBuffer.length >= this.configuration.collection.batchSize) {
      await this.flushAuditBuffer();
    }

    this.emit('audit:logged', entry);
    return entry;
  }

}
