function __method_wrapper__() {
MemoryCache.prototype.add = function (key, value, time, timeoutCallback) {
    let old = this.cache[key];
    let instance = this;

    let entry = {
        value: value,
        expire: time + Date.now(),
        timeout: setTimeout(function () {
            instance.delete(key);
            return timeoutCallback && typeof timeoutCallback === "function" && timeoutCallback(value, key);
        }, time)
    };

    this.cache[key] = entry;
    this.size = Object.keys(this.cache).length;

    return entry;
};

}
