function __method_wrapper__() {
  async executeScan(scanId: string): Promise<void> {
    const scan = this.scans.get(scanId);
    if (!scan) {
      throw new Error(`Scan not found: ${scanId}`);
    }

    if (scan.status !== 'pending') {
      throw new Error(`Scan ${scanId} is not in pending status`);
    }

    scan.status = 'running';
    scan.updatedAt = new Date();

    this.addAuditEntry(scan, 'system', 'scan_started', 'scan', {
      scanId,
      target: scan.target,
    });

    await this.saveScan(scan);
    this.emit('scan:started', scan);

    try {
      const startTime = Date.now();

      // Execute the appropriate scanner
      const findings = await this.executeScanEngine(scan);

      const endTime = Date.now();
      scan.metrics.scanDuration = endTime - startTime;
      scan.results = findings;
      scan.status = 'completed';

      // Calculate metrics
      this.calculateScanMetrics(scan);

      // Run compliance checks
      await this.runComplianceChecks(scan);

      // Generate remediation recommendations
      await this.generateRemediationRecommendations(scan);

      // Check notification thresholds
      await this.checkNotificationThresholds(scan);

      scan.updatedAt = new Date();

      this.addAuditEntry(scan, 'system', 'scan_completed', 'scan', {
        scanId,
        duration: scan.metrics.scanDuration,
        findingsCount: scan.results.length,
      });

      await this.saveScan(scan);
      this.emit('scan:completed', scan);

      this.logger.info(
        `Security scan completed: ${scan.name} (${scan.id}) - ${scan.results.length} findings`,
      );
    } catch (error) {
      scan.status = 'failed';
      scan.updatedAt = new Date();

      this.addAuditEntry(scan, 'system', 'scan_failed', 'scan', {
        scanId,
        error: error instanceof Error ? error.message : String(error),
      });

      await this.saveScan(scan);
      this.emit('scan:failed', { scan, error });

      this.logger.error(`Security scan failed: ${scan.name} (${scanId})`, { error });
      throw error;
    }
  }

}
