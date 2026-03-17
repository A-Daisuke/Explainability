function __method_wrapper__() {
				return new Promise((resolveFn, rejectFn) => {
					opt.xhr.onreadystatechange = callback.bind(opt, resolveFn, rejectFn);
					opt.method = String(opt.method ?? 'GET').toUpperCase();

					if ('query' in opt) {
						const q = (opt.query != null) ? Object.keys(opt.query).map(k => {
							if (opt.query[k] != null) {
								const v = (typeof(opt.query[k]) == 'object')
									? JSON.stringify(opt.query[k])
									: String(opt.query[k]);

								return '%s=%s'.format(encodeURIComponent(k), encodeURIComponent(v));
							}
							else {
								return encodeURIComponent(k);
							}
						}).join('&') : '';

						if (q !== '') {
							switch (opt.method) {
							case 'GET':
							case 'HEAD':
							case 'POST':
							case 'OPTIONS':
								opt.url += ((/\?/).test(opt.url) ? '&' : '?') + q;
								break;

							default:
								if (content == null) {
									content = q;
									contenttype = 'application/x-www-form-urlencoded';
								}
							}
						}
					}

					if (!opt.cache)
						opt.url += ((/\?/).test(opt.url) ? '&' : '?') + (new Date()).getTime();

					if (isQueueableRequest(opt)) {
						requestQueue.push([opt, rejectFn, resolveFn]);
						requestAnimationFrame(flushRequestQueue);
						return;
					}

					if ('username' in opt && 'password' in opt)
						opt.xhr.open(opt.method, opt.url, true, opt.username, opt.password);
					else
						opt.xhr.open(opt.method, opt.url, true);

					opt.xhr.responseType = opt.responseType ?? 'text';

					if ('overrideMimeType' in opt.xhr)
						opt.xhr.overrideMimeType('application/octet-stream');

					if ('timeout' in opt)
						opt.xhr.timeout = +opt.timeout;

					if ('credentials' in opt)
						opt.xhr.withCredentials = !!opt.credentials;

					if (opt.content != null) {
						switch (typeof(opt.content)) {
						case 'function':
							content = opt.content(opt.xhr);
							break;

						case 'object':
							if (!(opt.content instanceof FormData)) {
								content = JSON.stringify(opt.content);
								contenttype = 'application/json';
							}
							else {
								content = opt.content;
							}
							break;

						default:
							content = String(opt.content);
						}
					}

					if ('headers' in opt)
						for (const header in opt.headers)
							if (opt.headers.hasOwnProperty(header)) {
								if (header.toLowerCase() != 'content-type')
									opt.xhr.setRequestHeader(header, opt.headers[header]);
								else
									contenttype = opt.headers[header];
							}

					if ('progress' in opt && 'upload' in opt.xhr)
						opt.xhr.upload.addEventListener('progress', opt.progress);

					if (contenttype != null)
						opt.xhr.setRequestHeader('Content-Type', contenttype);

					try {
						opt.xhr.send(content);
					}
					catch (e) {
						rejectFn.call(opt, e);
					}
				});

}
