export async function generateTokenUsageReport(tokenData, agentFilter) {
  const reportDir = path.join(process.cwd(), 'analysis-reports');
  await fs.mkdir(reportDir, { recursive: true });
  
  const timestamp = Date.now();
  const csvPath = path.join(reportDir, `token-usage-${timestamp}.csv`);
  
  // Create CSV content
  let csv = 'Timestamp,Session,Agent,Command,Input Tokens,Output Tokens,Total\n';
  
  if (tokenData.history) {
    tokenData.history.forEach(entry => {
      const date = new Date(entry.timestamp).toISOString();
      const total = entry.inputTokens + entry.outputTokens;
      csv += `${date},${entry.sessionId},${entry.agentType},${entry.command},${entry.inputTokens},${entry.outputTokens},${total}\n`;
    });
  }
  
  // Add summary at the end
  csv += '\nSUMMARY\n';
  csv += `Total Input Tokens,${tokenData.input}\n`;
  csv += `Total Output Tokens,${tokenData.output}\n`;
  csv += `Total Tokens,${tokenData.total}\n`;
  
  if (tokenData.byAgent) {
    csv += '\nBY AGENT TYPE\n';
    Object.entries(tokenData.byAgent).forEach(([type, usage]) => {
      csv += `${type},${usage}\n`;
    });
  }
  
  await fs.writeFile(csvPath, csv);
  return csvPath;
}
