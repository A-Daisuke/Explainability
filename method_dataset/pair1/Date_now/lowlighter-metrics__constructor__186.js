class __C__ {
    constructor(options){
        if (options) {
            this.name = options.name;
            this.value = options.value;
            this.path = options.path;
            this.domain = options.domain;
            this.expires = options.expires;
            this.maxAge = options.maxAge;
            this.secure = options.secure;
            this.httpOnly = options.httpOnly;
            this.sameSite = options.sameSite;
            if (options.creationDate) {
                this.creationDate = options.creationDate;
            }
        }
        Object.defineProperty(this, "creationIndex", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: ++Cookie.cookiesCreated
        });
    }

}
