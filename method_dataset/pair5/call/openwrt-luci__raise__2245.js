function __method_wrapper__() {
		raise(type, fmt, ...args) {
			let e = null;
			const msg = fmt ? String.prototype.format.call(fmt, ...args) : null;
			const stack = [];

			if (type instanceof Error) {
				e = type;

				if (msg)
					e.message = `${msg}: ${e.message}`;
			}
			else {
				try { throw new Error('stacktrace') }
				catch (e2) { stack.push(...(e2.stack ?? '').split(/\n/)) }

				e = new (window[type ?? 'Error'] ?? Error)(msg ?? 'Unspecified error');
				e.name = type ?? 'Error';
			}

			for (let i = 0; i < stack.length; i++) {
				const frame = stack[i].replace(/(.*?)@(.+):(\d+):(\d+)/g, 'at $1 ($2:$3:$4)').trim();
				stack[i] = frame ? `  ${frame}` : '';
			}

			if (!/^  at /.test(stack[0]))
				stack.shift();

			if (/\braise /.test(stack[0]))
				stack.shift();

			if (/\berror /.test(stack[0]))
				stack.shift();

			if (stack.length)
				e.message += `\n${stack.join('\n')}`;

			if (window.console && console.debug)
				console.debug(e);

			throw e;
		},

}
