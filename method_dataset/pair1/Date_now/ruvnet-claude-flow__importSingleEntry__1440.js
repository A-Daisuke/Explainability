function __method_wrapper__() {
  private async importSingleEntry(
    item: any,
    options: ImportOptions,
  ): Promise<{
    action: 'imported' | 'updated' | 'skipped' | 'conflict';
    message?: string;
  }> {
    const existing = this.findEntryByKey(item.key, item.namespace || options.namespace);

    if (existing) {
      switch (options.conflictResolution) {
        case 'skip':
          return { action: 'skipped' };
        case 'overwrite':
          await this.update(item.key, item.value, { namespace: item.namespace });
          return { action: 'updated' };
        case 'merge':
          await this.update(item.key, item.value, {
            namespace: item.namespace,
            merge: true,
          });
          return { action: 'updated' };
        case 'rename':
          const newKey = `${item.key}_imported_${Date.now()}`;
          await this.store(newKey, item.value, {
            namespace: item.namespace,
            type: item.type,
            tags: item.tags,
            metadata: item.metadata,
          });
          return { action: 'imported' };
        default:
          return {
            action: 'conflict',
            message: `Key '${item.key}' already exists`,
          };
      }
    } else {
      await this.store(item.key, item.value, {
        namespace: item.namespace || options.namespace,
        type: item.type,
        tags: item.tags,
        metadata: item.metadata,
      });
      return { action: 'imported' };
    }
  }

}
