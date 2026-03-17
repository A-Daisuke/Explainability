function __method_wrapper__() {
        res.end = function (content, encoding) {
            if (shouldCacheResponse(req, res, toggle)) {
                accumulateContent(res, content);

                if (res._apicache.cacheable && res._apicache.content) {
                    addIndexEntries(key, req);
                    let headers = res._apicache.headers || getSafeHeaders(res);
                    let cacheObject = createCacheObject(
                        res.statusCode,
                        headers,
                        res._apicache.content,
                        encoding
                    );
                    cacheResponse(key, cacheObject, duration);

                    // display log entry
                    let elapsed = new Date() - req.apicacheTimer;
                    debug("adding cache entry for \"" + key + "\" @ " + strDuration, logDuration(elapsed));
                    debug("_apicache.headers: ", res._apicache.headers);
                    debug("res.getHeaders(): ", getSafeHeaders(res));
                    debug("cacheObject: ", cacheObject);
                }
            }

            return res._apicache.end.apply(this, arguments);
        };

}
