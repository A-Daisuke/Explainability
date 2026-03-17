class __C__ {
  async saveArtifact(filename, content) {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');

      const artifactDir = path.join(process.cwd(), 'sparc-artifacts', this.options.namespace);
      await fs.mkdir(artifactDir, { recursive: true });

      const filePath = path.join(artifactDir, filename);
      await fs.writeFile(filePath, content, 'utf8');

      this.artifacts.push({
        filename,
        path: filePath,
        timestamp: Date.now(),
      });

      console.log(`📄 Saved artifact: ${filename}`);
      return filePath;
    } catch (error) {
      console.warn(`⚠️ Failed to save artifact: ${error.message}`);
      return null;
    }
  }

}
