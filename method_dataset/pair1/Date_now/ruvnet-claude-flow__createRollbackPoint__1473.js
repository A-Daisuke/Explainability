function __method_wrapper__() {
  public async createRollbackPoint(
    message: string = 'Automated rollback point',
    tags: string[] = []
  ): Promise<string> {
    try {
      // Ensure we're in a git repository
      await this.ensureGitRepo();
      
      if (this.safetyChecks) {
        await this.performSafetyChecks();
      }
      
      // Create backup branch
      await this.createBackupBranch();
      
      // Stage all changes
      await execAsync('git add -A', { cwd: this.gitDir });
      
      // Create commit with rollback metadata
      const rollbackMessage = this.formatRollbackMessage(message, tags);
      await execAsync(`git commit -m "${rollbackMessage}"`, { cwd: this.gitDir });
      
      // Get commit hash
      const { stdout: commitHash } = await execAsync('git rev-parse HEAD', { cwd: this.gitDir });
      const hash = commitHash.trim();
      
      // Create tag for easy reference
      const tagName = `rollback-${Date.now()}`;
      await execAsync(`git tag -a "${tagName}" -m "Rollback point: ${message}"`, { cwd: this.gitDir });
      
      this.emit('rollback_point_created', { hash, tag: tagName, message });
      return hash;
      
    } catch (error) {
      this.emit('error', new Error(`Failed to create rollback point: ${error}`));
      throw error;
    }
  }

}
