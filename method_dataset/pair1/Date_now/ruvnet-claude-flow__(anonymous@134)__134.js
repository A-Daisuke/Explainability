function __method_wrapper__() {
    it('should create checkpoints during operations', async () => {
      const checkpointData = {
        phase: 'file-creation',
        timestamp: Date.now(),
        files: ['CLAUDE.md', '.claude/settings.json']
      };

      const result = await rollbackSystem.createCheckpoint('test-checkpoint', checkpointData);

      expect(result.success).toBe(true);
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('checkpoint.json'),
        expect.stringContaining('"phase":"file-creation"')
      );
    });

}
