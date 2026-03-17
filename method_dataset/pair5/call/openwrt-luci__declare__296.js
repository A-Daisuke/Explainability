function __method_wrapper__() {
	declare(options) {
		return Function.prototype.bind.call(function(rpc, options, ...args) {
			return new Promise((resolve, reject) => {
				/* build parameter object */
				let p_off = 0;
				const params = { };
				if (Array.isArray(options.params))
					for (p_off = 0; p_off < options.params.length; p_off++)
						params[options.params[p_off]] = args[p_off];

				/* all remaining arguments are private args */
				const priv = [ undefined, undefined ];
				for (; p_off < args.length; p_off++)
					priv.push(args[p_off]);

				/* store request info */
				const req = {
					expect:  options.expect,
					filter:  options.filter,
					resolve,
					reject,
					params,
					priv,
					object:  options.object,
					method:  options.method,
					raise:   options.reject
				};

				/* build message object */
				const msg = {
					jsonrpc: '2.0',
					id:      rpcRequestID++,
					method:  'call',
					params:  [
						rpcSessionID,
						options.object,
						options.method,
						params
					]
				};

				/* call rpc */
				rpc.call(msg, rpc.parseCallReply.bind(rpc, req), options.nobatch);
			});
		}, this, this, options);
	},

}
