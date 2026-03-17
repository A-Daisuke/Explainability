export async function exportMetrics(format = 'json') {
  const timestamp = Date.now();
  const reportsDir = path.join(process.cwd(), 'analysis-reports');
  
  await fs.mkdir(reportsDir, { recursive: true });
  
  if (format === 'json') {
    const reportPath = path.join(reportsDir, `performance-${timestamp}.json`);
    const data = {
      timestamp: new Date().toISOString(),
      performance: metricsCache.performance,
      tasks: metricsCache.tasks.slice(-100), // Last 100 tasks
      agents: metricsCache.agents,
      system: metricsCache.system.slice(-50) // Last 50 system snapshots
    };
    
    await fs.writeFile(reportPath, JSON.stringify(data, null, 2));
    return reportPath;
  }
  
  if (format === 'csv') {
    const reportPath = path.join(reportsDir, `performance-${timestamp}.csv`);
    let csv = 'Timestamp,Type,Metric,Value\n';
    
    // Add performance metrics
    Object.entries(metricsCache.performance).forEach(([key, value]) => {
      csv += `${new Date().toISOString()},performance,${key},${value}\n`;
    });
    
    // Add agent metrics
    Object.entries(metricsCache.agents).forEach(([type, data]) => {
      csv += `${new Date().toISOString()},agent,${type}_total,${data.total}\n`;
      csv += `${new Date().toISOString()},agent,${type}_success_rate,${data.total > 0 ? (data.successful / data.total) * 100 : 0}\n`;
      csv += `${new Date().toISOString()},agent,${type}_avg_duration,${data.total > 0 ? data.totalDuration / data.total : 0}\n`;
    });
    
    await fs.writeFile(reportPath, csv);
    return reportPath;
  }
  
  if (format === 'html') {
    const reportPath = path.join(reportsDir, `performance-${timestamp}.html`);
    const report = await getPerformanceReport('24h');
    
    const html = generateHTMLReport(report);
    await fs.writeFile(reportPath, html);
    return reportPath;
  }
  
  throw new Error(`Unsupported format: ${format}`);
}
