function __method_wrapper__() {
  async createSecurityIncident(incidentData: {
    title: string;
    description: string;
    severity: SecuritySeverity;
    type: SecurityIncident['type'];
    source: SecurityIncident['source'];
    affected?: Partial<SecurityIncident['affected']>;
  }): Promise<SecurityIncident> {
    const incident: SecurityIncident = {
      id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: incidentData.title,
      description: incidentData.description,
      severity: incidentData.severity,
      status: 'open',
      type: incidentData.type,
      source: incidentData.source,
      affected: {
        systems: [],
        data: [],
        users: [],
        ...incidentData.affected,
      },
      timeline: {
        detected: new Date(),
        reported: new Date(),
        acknowledged: new Date(),
      },
      response: {
        assignedTo: [],
        actions: [],
        communications: [],
        lessons: [],
      },
      evidence: {
        logs: [],
        files: [],
        screenshots: [],
        forensics: [],
      },
      impact: {
        confidentiality: 'none',
        integrity: 'none',
        availability: 'none',
      },
      rootCause: {
        primary: '',
        contributing: [],
        analysis: '',
      },
      remediation: {
        immediate: [],
        shortTerm: [],
        longTerm: [],
        preventive: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      auditLog: [],
    };

    this.addAuditEntry(incident, 'system', 'incident_created', 'incident', {
      incidentId: incident.id,
      severity: incident.severity,
      type: incident.type,
    });

    this.incidents.set(incident.id, incident);
    await this.saveIncident(incident);

    // Auto-assign based on severity and type
    await this.autoAssignIncident(incident);

    // Send immediate notifications for high/critical incidents
    if (incident.severity === 'critical' || incident.severity === 'high') {
      await this.sendIncidentNotification(incident);
    }

    this.emit('incident:created', incident);
    this.logger.info(`Security incident created: ${incident.title} (${incident.id})`);

    return incident;
  }

}
