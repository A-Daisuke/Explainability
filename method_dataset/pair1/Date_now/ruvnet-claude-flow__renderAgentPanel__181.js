function __method_wrapper__() {
  renderAgentPanel(agent, width, spinner) {
    const lines = [];
    
    // Agent header with icon and name
    const icon = this.getAgentIcon(agent.type);
    const statusIcon = this.getStatusIcon(agent.status, spinner);
    const shortName = agent.name.length > 20 ? agent.name.substring(0, 17) + '...' : agent.name;
    const header = `${icon} ${shortName}`;
    lines.push(this.truncate(`${statusIcon} ${header}`, width));
    
    // Status line with timer
    const status = this.getStatusText(agent.status);
    const elapsed = agent.startTime ? this.formatDuration(Date.now() - agent.startTime) : '--:--';
    lines.push(this.truncate(`${status} │ ${elapsed}`, width));
    
    // Progress bar (compact)
    if (agent.status === 'active') {
      const compactBar = this.renderCompactProgressBar(agent.progress, width - 10);
      lines.push(this.truncate(`[${compactBar}] ${agent.progress}%`, width));
    } else {
      lines.push(' '.repeat(width));
    }
    
    // Current activity (shorter)
    if (agent.lastActivity) {
      const shortActivity = agent.lastActivity.length > 25 ? agent.lastActivity.substring(0, 22) + '...' : agent.lastActivity;
      lines.push(this.truncate(`→ ${shortActivity}`, width));
    } else {
      lines.push(this.truncate('→ Waiting...', width));
    }
    
    // Stats only
    lines.push(this.truncate(`Events: ${agent.events}`, width));
    
    // Pad to consistent height (reduced from 6 to 5)
    while (lines.length < 5) {
      lines.push(' '.repeat(width));
    }
    
    return lines.join('\n║ ').split('\n').map(l => l.substring(2)).join('\n║ ');
  }

}
