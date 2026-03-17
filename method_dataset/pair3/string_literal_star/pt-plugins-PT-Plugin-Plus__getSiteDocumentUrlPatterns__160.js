function __method_wrapper__() {
  private getSiteDocumentUrlPatterns(site: Site): string[] {
    let url = site.url + "";
    if (url.substr(-1) != "/") {
      url += "/";
    }
    let documentUrlPatterns: string[] = [`*://${site.host}/*`, `${url}`];

    if (site.cdn && site.cdn.length > 0) {
      for (let i = 0; i < site.cdn.length; i++) {
        const url = site.cdn[i]
        documentUrlPatterns.push(`${url}${url.substr(-1) != '/' ? '/*' : '*'}`, url);
      }
    }

    return documentUrlPatterns;
  }

}
