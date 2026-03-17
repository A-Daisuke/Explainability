function __method_wrapper__() {
  async generateReport(
    projectId: string,
    type: ProjectReport['type'],
    userId: string = 'system',
  ): Promise<ProjectReport> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const report: ProjectReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      type,
      title: `${type.toUpperCase()} Report - ${project.name}`,
      summary: '',
      details: {},
      recommendations: [],
      generatedAt: new Date(),
      generatedBy: userId,
      format: 'json',
      recipients: [],
    };

    switch (type) {
      case 'status':
        report.summary = `Project ${project.name} is currently ${project.status}`;
        report.details = {
          status: project.status,
          progress: this.calculateProjectProgress(project),
          phases: project.phases.map((p) => ({
            name: p.name,
            status: p.status,
            completion: p.completionPercentage,
          })),
          timeline: project.timeline,
          nextMilestones: this.getUpcomingMilestones(project),
        };
        break;

      case 'financial':
        report.summary = `Budget utilization: ${((project.budget.spent / project.budget.total) * 100).toFixed(1)}%`;
        report.details = {
          budget: project.budget,
          costBreakdown: this.calculateCostBreakdown(project),
          variance: project.budget.spent - project.budget.total,
          projectedCost: this.projectFinalCost(project),
        };
        break;

      case 'quality':
        const qualityMetrics = this.calculateQualityMetrics(project);
        report.summary = `Overall quality score: ${qualityMetrics.overall.toFixed(1)}%`;
        report.details = {
          qualityMetrics,
          qualityGates: project.qualityGates,
          recommendations: this.generateQualityRecommendations(project),
        };
        break;

      case 'risk':
        const risks = this.getAllRisks(project);
        report.summary = `${risks.filter((r) => r.status === 'open').length} open risks identified`;
        report.details = {
          risks,
          riskMatrix: this.generateRiskMatrix(risks),
          mitigation: this.generateRiskMitigation(risks),
        };
        break;

      case 'resource':
        report.summary = `${project.collaboration.teamMembers.length} team members, ${this.getTotalResources(project)} resources allocated`;
        report.details = {
          teamMembers: project.collaboration.teamMembers,
          resourceAllocation: this.calculateResourceAllocation(project),
          utilization: this.calculateResourceUtilization(project),
          capacity: this.calculateCapacity(project),
        };
        break;

      case 'compliance':
        const compliance = this.calculateComplianceStatus(project);
        report.summary = `${compliance.compliant} of ${compliance.total} requirements met`;
        report.details = {
          requirements: project.complianceRequirements,
          status: compliance,
          gaps: this.identifyComplianceGaps(project),
          recommendations: this.generateComplianceRecommendations(project),
        };
        break;
    }

    this.addAuditEntry(project, userId, 'report_generated', 'report', {
      projectId,
      reportId: report.id,
      reportType: type,
    });

    this.emit('report:generated', { project, report });
    return report;
  }

}
