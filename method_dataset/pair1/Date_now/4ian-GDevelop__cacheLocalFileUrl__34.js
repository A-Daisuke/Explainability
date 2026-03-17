function __method_wrapper__() {
  cacheLocalFileUrl(
    project: gdProject,
    filename: string,
    systemFilename: string,
    disableCacheBurst: boolean
  ): string {
    const cache = this._getProjectCache(project);

    if (!disableCacheBurst) {
      // The URL is cached with an extra "cache-bursting" parameter.
      // If the cache is emptied or changed, local files will have another
      // value for this parameter, forcing the browser to reload the images.
      return (cache[filename] = `${systemFilename}?cache=${Date.now()}`);
    } else {
      return (cache[filename] = systemFilename);
    }
  }

}
