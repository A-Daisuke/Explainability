function __method_wrapper__() {
            return retryify_queue_1.default.schedule().then(cleanup => {
                return fn.apply(undefined, arguments).then(result => {
                    cleanup();
                    return result;
                }, error => {
                    cleanup();
                    if (Date.now() >= timestamp)
                        throw error;
                    if (isRetriableError(error)) {
                        const delay = Math.round(100 + (400 * Math.random())), delayPromise = new Promise(resolve => setTimeout(resolve, delay));
                        return delayPromise.then(() => attempt.apply(undefined, arguments));
                    }
                    throw error;
                });
            });

}
