function __method_wrapper__() {
		handleReadyStateChange(resolveFn, rejectFn, ev) {
			const xhr = this.xhr, duration = Date.now() - this.start;

			if (xhr.readyState !== 4)
				return;

			if (xhr.status === 0 && xhr.statusText === '') {
				if (duration >= this.timeout)
					rejectFn.call(this, new Error('XHR request timed out'));
				else
					rejectFn.call(this, new Error('XHR request aborted by browser'));
			}
			else {
				const response = new Response(
					xhr, xhr.responseURL ?? this.url, duration);

				Promise.all(Request.interceptors.map(fn => fn(response)))
					.then(resolveFn.bind(this, response))
					.catch(rejectFn.bind(this));
			}
		},

}
