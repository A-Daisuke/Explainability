async function getModelFile(path_or_repo_id, filename, fatal = true, options = {}) {

    if (!_env_js__WEBPACK_IMPORTED_MODULE_3__.env.allowLocalModels) {
        // User has disabled local models, so we just make sure other settings are correct.

        if (options.local_files_only) {
            throw Error("Invalid configuration detected: local models are disabled (`env.allowLocalModels=false`) but you have requested to only use local models (`local_files_only=true`).")
        } else if (!_env_js__WEBPACK_IMPORTED_MODULE_3__.env.allowRemoteModels) {
            throw Error("Invalid configuration detected: both local and remote models are disabled. Fix by setting `env.allowLocalModels` or `env.allowRemoteModels` to `true`.")
        }
    }

    // Initiate file retrieval
    (0,_core_js__WEBPACK_IMPORTED_MODULE_4__.dispatchCallback)(options.progress_callback, {
        status: 'initiate',
        name: path_or_repo_id,
        file: filename
    })

    // First, check if the a caching backend is available
    // If no caching mechanism available, will download the file every time
    let cache;
    if (!cache && _env_js__WEBPACK_IMPORTED_MODULE_3__.env.useBrowserCache) {
        if (typeof caches === 'undefined') {
            throw Error('Browser cache is not available in this environment.')
        }
        try {
            // In some cases, the browser cache may be visible, but not accessible due to security restrictions.
            // For example, when running an application in an iframe, if a user attempts to load the page in
            // incognito mode, the following error is thrown: `DOMException: Failed to execute 'open' on 'CacheStorage':
            // An attempt was made to break through the security policy of the user agent.`
            // So, instead of crashing, we just ignore the error and continue without using the cache.
            cache = await caches.open('transformers-cache');
        } catch (e) {
            console.warn('An error occurred while opening the browser cache:', e);
        }
    }

    if (!cache && _env_js__WEBPACK_IMPORTED_MODULE_3__.env.useFSCache) {
        // TODO throw error if not available

        // If `cache_dir` is not specified, use the default cache directory
        cache = new FileCache(options.cache_dir ?? _env_js__WEBPACK_IMPORTED_MODULE_3__.env.cacheDir);
    }

    if (!cache && _env_js__WEBPACK_IMPORTED_MODULE_3__.env.useCustomCache) {
        // Allow the user to specify a custom cache system.
        if (!_env_js__WEBPACK_IMPORTED_MODULE_3__.env.customCache) {
            throw Error('`env.useCustomCache=true`, but `env.customCache` is not defined.')
        }

        // Check that the required methods are defined:
        if (!_env_js__WEBPACK_IMPORTED_MODULE_3__.env.customCache.match || !_env_js__WEBPACK_IMPORTED_MODULE_3__.env.customCache.put) {
            throw new Error(
                "`env.customCache` must be an object which implements the `match` and `put` functions of the Web Cache API. " +
                "For more information, see https://developer.mozilla.org/en-US/docs/Web/API/Cache"
            )
        }
        cache = _env_js__WEBPACK_IMPORTED_MODULE_3__.env.customCache;
    }

    const revision = options.revision ?? 'main';

    let requestURL = pathJoin(path_or_repo_id, filename);
    let localPath = pathJoin(_env_js__WEBPACK_IMPORTED_MODULE_3__.env.localModelPath, requestURL);

    let remoteURL = pathJoin(
        _env_js__WEBPACK_IMPORTED_MODULE_3__.env.remoteHost,
        _env_js__WEBPACK_IMPORTED_MODULE_3__.env.remotePathTemplate.replaceAll('{model}', path_or_repo_id)
            .replaceAll('{revision}', encodeURIComponent(revision)),
        filename
    );

    // Choose cache key for filesystem cache
    // When using the main revision (default), we use the request URL as the cache key.
    // If a specific revision is requested, we account for this in the cache key.
    let fsCacheKey = revision === 'main' ? requestURL : pathJoin(path_or_repo_id, revision, filename);

    /** @type {string} */
    let cacheKey;
    let proposedCacheKey = cache instanceof FileCache ? fsCacheKey : remoteURL;

    // Whether to cache the final response in the end.
    let toCacheResponse = false;

    /** @type {Response|FileResponse|undefined} */
    let response;

    if (cache) {
        // A caching system is available, so we try to get the file from it.
        //  1. We first try to get from cache using the local path. In some environments (like deno),
        //     non-URL cache keys are not allowed. In these cases, `response` will be undefined.
        //  2. If no response is found, we try to get from cache using the remote URL or file system cache.
        response = await tryCache(cache, localPath, proposedCacheKey);
    }

    const cacheHit = response !== undefined;

    if (response === undefined) {
        // Caching not available, or file is not cached, so we perform the request

        if (_env_js__WEBPACK_IMPORTED_MODULE_3__.env.allowLocalModels) {
            // Accessing local models is enabled, so we try to get the file locally.
            // If request is a valid HTTP URL, we skip the local file check. Otherwise, we try to get the file locally.
            const isURL = isValidHttpUrl(requestURL);
            if (!isURL) {
                try {
                    response = await getFile(localPath);
                    cacheKey = localPath; // Update the cache key to be the local path
                } catch (e) {
                    // Something went wrong while trying to get the file locally.
                    // NOTE: error handling is done in the next step (since `response` will be undefined)
                    console.warn(`Unable to load from local path "${localPath}": "${e}"`);
                }
            } else if (options.local_files_only) {
                throw new Error(`\`local_files_only=true\`, but attempted to load a remote file from: ${requestURL}.`);
            } else if (!_env_js__WEBPACK_IMPORTED_MODULE_3__.env.allowRemoteModels) {
                throw new Error(`\`env.allowRemoteModels=false\`, but attempted to load a remote file from: ${requestURL}.`);
            }
        }

        if (response === undefined || response.status === 404) {
            // File not found locally. This means either:
            // - The user has disabled local file access (`env.allowLocalModels=false`)
            // - the path is a valid HTTP url (`response === undefined`)
            // - the path is not a valid HTTP url and the file is not present on the file system or local server (`response.status === 404`)

            if (options.local_files_only || !_env_js__WEBPACK_IMPORTED_MODULE_3__.env.allowRemoteModels) {
                // User requested local files only, but the file is not found locally.
                if (fatal) {
                    throw Error(`\`local_files_only=true\` or \`env.allowRemoteModels=false\` and file was not found locally at "${localPath}".`);
                } else {
                    // File not found, but this file is optional.
                    // TODO in future, cache the response?
                    return null;
                }
            }

            // File not found locally, so we try to download it from the remote server
            response = await getFile(remoteURL);

            if (response.status !== 200) {
                return handleError(response.status, remoteURL, fatal);
            }

            // Success! We use the proposed cache key from earlier
            cacheKey = proposedCacheKey;
        }

        // Only cache the response if:
        toCacheResponse =
            cache                              // 1. A caching system is available
            && typeof Response !== 'undefined' // 2. `Response` is defined (i.e., we are in a browser-like environment)
            && response instanceof Response    // 3. result is a `Response` object (i.e., not a `FileResponse`)
            && response.status === 200         // 4. request was successful (status code 200)
    }

    // Start downloading
    (0,_core_js__WEBPACK_IMPORTED_MODULE_4__.dispatchCallback)(options.progress_callback, {
        status: 'download',
        name: path_or_repo_id,
        file: filename
    })

    const progressInfo = {
        status: 'progress',
        name: path_or_repo_id,
        file: filename
    }

    /** @type {Uint8Array} */
    let buffer;

    if (!options.progress_callback) {
        // If no progress callback is specified, we can use the `.arrayBuffer()`
        // method to read the response.
        buffer = new Uint8Array(await response.arrayBuffer());

    } else if (
        cacheHit // The item is being read from the cache
        &&
        typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent) // We are in Firefox
    ) {
        // Due to bug in Firefox, we cannot display progress when loading from cache.
        // Fortunately, since this should be instantaneous, this should not impact users too much.
        buffer = new Uint8Array(await response.arrayBuffer());

        // For completeness, we still fire the final progress callback
        (0,_core_js__WEBPACK_IMPORTED_MODULE_4__.dispatchCallback)(options.progress_callback, {
            ...progressInfo,
            progress: 100,
            loaded: buffer.length,
            total: buffer.length,
        })
    } else {
        buffer = await readResponse(response, data => {
            (0,_core_js__WEBPACK_IMPORTED_MODULE_4__.dispatchCallback)(options.progress_callback, {
                ...progressInfo,
                ...data,
            })
        })
    }

    if (
        // Only cache web responses
        // i.e., do not cache FileResponses (prevents duplication)
        toCacheResponse && cacheKey
        &&
        // Check again whether request is in cache. If not, we add the response to the cache
        (await cache.match(cacheKey) === undefined)
    ) {
        // NOTE: We use `new Response(buffer, ...)` instead of `response.clone()` to handle LFS files
        await cache.put(cacheKey, new Response(buffer, {
            headers: response.headers
        }))
            .catch(err => {
                // Do not crash if unable to add to cache (e.g., QuotaExceededError).
                // Rather, log a warning and proceed with execution.
                console.warn(`Unable to add response to browser cache: ${err}.`);
            });

    }

    (0,_core_js__WEBPACK_IMPORTED_MODULE_4__.dispatchCallback)(options.progress_callback, {
        status: 'done',
        name: path_or_repo_id,
        file: filename
    });

    return buffer;
}
