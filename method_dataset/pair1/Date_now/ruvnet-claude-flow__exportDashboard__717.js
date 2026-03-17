function __method_wrapper__() {
  async exportDashboard(
    dashboardId: string,
    format: ExportFormat,
    options?: {
      timeRange?: { start: Date; end: Date };
      filters?: Record<string, any>;
    }
  ): Promise<string> {
    const exportId = `export-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    const exportJob: ExportJob = {
      id: exportId,
      type: 'dashboard',
      target: dashboardId,
      format,
      options: options || {},
      status: 'pending',
      createdAt: new Date(),
      progress: 0,
    };
    
    this.exportQueue.push(exportJob);
    this.processExportQueue();
    
    return exportId;
  }

}
