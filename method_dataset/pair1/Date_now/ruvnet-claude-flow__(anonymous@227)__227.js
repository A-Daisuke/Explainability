function __method_wrapper__() {
    it('should perform partial rollback for specific phase', async () => {
      // Mock checkpoint data
      fs.readFile.mockResolvedValue(JSON.stringify({
        phase: 'file-creation',
        timestamp: Date.now(),
        files: ['CLAUDE.md'],
        actions: [
          { type: 'create', path: 'CLAUDE.md' },
          { type: 'mkdir', path: '.claude' }
        ]
      }));

      const result = await rollbackSystem.performPartialRollback('file-creation');

      expect(result.success).toBe(true);
      expect(fs.rm).toHaveBeenCalledWith(expect.stringContaining('CLAUDE.md'));
      expect(fs.rm).toHaveBeenCalledWith(expect.stringContaining('.claude'));
    });

}
