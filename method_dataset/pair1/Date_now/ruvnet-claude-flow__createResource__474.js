function __method_wrapper__() {
  async createResource(resourceData: {
    name: string;
    type: CloudResource['type'];
    providerId: string;
    region: string;
    configuration: Partial<CloudResource['configuration']>;
    metadata: Partial<CloudResource['metadata']>;
  }): Promise<CloudResource> {
    const provider = this.providers.get(resourceData.providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${resourceData.providerId}`);
    }

    if (provider.status !== 'active') {
      throw new Error(`Provider is not active: ${provider.name}`);
    }

    const resource: CloudResource = {
      id: `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: resourceData.name,
      type: resourceData.type,
      providerId: resourceData.providerId,
      region: resourceData.region,
      status: 'creating',
      configuration: {
        size: 'small',
        ports: [],
        environment: {},
        volumes: [],
        networks: [],
        tags: {},
        ...resourceData.configuration,
      },
      monitoring: {
        enabled: true,
        metrics: [],
        alerts: [],
        healthChecks: [],
      },
      security: {
        encryption: true,
        backups: true,
        accessControl: [],
        vulnerabilityScanning: true,
        complianceFrameworks: [],
      },
      costs: {
        hourlyRate: this.calculateResourceCost(
          provider,
          resourceData.type,
          resourceData.configuration.size || 'small',
        ),
        monthlyEstimate: 0,
        actualSpend: 0,
        lastBillingDate: new Date(),
        costBreakdown: {},
      },
      performance: {
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0,
        uptime: 100,
        availability: 100,
      },
      metadata: {
        environment: 'development',
        owner: 'system',
        purpose: 'general',
        lifecycle: 'permanent',
        ...resourceData.metadata,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      auditLog: [],
    };

    // Calculate monthly estimate
    resource.costs.monthlyEstimate = resource.costs.hourlyRate * 24 * 30;

    this.addAuditEntry(resource, resource.metadata.owner, 'resource_created', 'resource', {
      resourceId: resource.id,
      resourceName: resource.name,
      providerId: resourceData.providerId,
    });

    this.resources.set(resource.id, resource);
    await this.saveResource(resource);

    // Start resource creation process
    await this.provisionResource(resource);

    this.emit('resource:created', resource);
    this.logger.info(`Cloud resource created: ${resource.name} (${resource.id})`);

    return resource;
  }

}
