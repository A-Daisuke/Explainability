function __method_wrapper__() {
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var i;
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( i=0 ; i<context.length ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = settings.length > 1
			? _unique( settings )
			: settings;
	
		// Initial data
		if ( data ) {
			// Chrome can throw a max stack error if apply is called with
			// too large an array, but apply is faster.
			if (data.length < 10000) {
				this.push.apply(this, data);
			}
			else {
				for (i=0 ; i<data.length ; i++) {
					this.push(data[i]);
				}
			}
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};

}
