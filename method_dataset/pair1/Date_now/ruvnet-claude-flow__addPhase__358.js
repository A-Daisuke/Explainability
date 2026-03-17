function __method_wrapper__() {
  async addPhase(projectId: string, phase: Omit<ProjectPhase, 'id'>): Promise<ProjectPhase> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const newPhase: ProjectPhase = {
      id: `phase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...phase,
    };

    project.phases.push(newPhase);
    project.updatedAt = new Date();

    this.addAuditEntry(project, 'system', 'phase_added', 'phase', {
      projectId,
      phaseId: newPhase.id,
      phaseName: newPhase.name,
    });

    await this.saveProject(project);
    this.emit('phase:added', { project, phase: newPhase });

    return newPhase;
  }

}
