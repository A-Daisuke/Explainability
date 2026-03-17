function __method_wrapper__() {
    return new Promise<any>((resolve?: any, reject?: any) => {
      if (resource.name && resource.code) {
        if (this.exists(resource.code)) {
          reject();
        } else {
          this.push(resource);
          i18n.locale = resource.code;
          this.currentLanguage = resource.code;
          this.initialized && this.onAdded.call(this, resource);
          resolve(resource.code);
        }
      } else {
        reject();
      }
    });

}
