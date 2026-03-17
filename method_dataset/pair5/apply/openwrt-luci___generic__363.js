function __method_wrapper__() {
	_generic: function(opts, host, plugin, plugin_instance, dtype, index) {
		var defs = [],
		    gopts = this.opts,
		    _args = [],
		    _sources = [],
		    _stack_neg = [],
		    _stack_pos = [],
		    _longest_name = 0,
		    _has_totals = false;

		/* use the plugin+instance+type as seed for the prng to ensure the
		   same pseudo-random color sequence for each render */
		random.seed(sfh([plugin, plugin_instance || '', dtype || ''].join('.')));

		function __def(source) {
			var inst = source.sname,
			    rrd  = source.rrd,
			    ds   = source.ds || 'value';

			_args.push(
				'DEF:%s_avg_raw=%s:%s:AVERAGE'.format(inst, rrd, ds),
				'CDEF:%s_avg=%s_avg_raw,%s'.format(inst, inst, source.transform_rpn)
			);

			if (!gopts.rrasingle)
				_args.push(
					'DEF:%s_min_raw=%s:%s:MIN'.format(inst, rrd, ds),
					'CDEF:%s_min=%s_min_raw,%s'.format(inst, inst, source.transform_rpn),
					'DEF:%s_max_raw=%s:%s:MAX'.format(inst, rrd, ds),
					'CDEF:%s_max=%s_max_raw,%s'.format(inst, inst, source.transform_rpn)
				);

			_args.push(
				'CDEF:%s_nnl=%s_avg,UN,0,%s_avg,IF'.format(inst, inst, inst)
			);
		}

		function __cdef(source) {
			var prev;

			if (source.flip)
				prev = _stack_neg[_stack_neg.length - 1];
			else
				prev = _stack_pos[_stack_pos.length - 1];

			/* is first source in stack or overlay source: source_stk = source_nnl */
			if (prev == null || source.overlay) {
				/* create cdef statement for cumulative stack (no NaNs) and also
				   for display (preserving NaN where no points should be displayed) */
				if (gopts.rrasingle || !gopts.rramax)
					_args.push(
						'CDEF:%s_stk=%s_nnl'.format(source.sname, source.sname),
						'CDEF:%s_plot=%s_avg'.format(source.sname, source.sname)
					);
				else
					_args.push(
						'CDEF:%s_stk=%s_nnl'.format(source.sname, source.sname),
						'CDEF:%s_plot=%s_max'.format(source.sname, source.sname)
					);
			}
			/* is subsequent source without overlay: source_stk = source_nnl + previous_stk */
			else {
				/* create cdef statement */
				if (gopts.rrasingle || !gopts.rramax)
					_args.push(
						'CDEF:%s_stk=%s_nnl,%s_stk,+'.format(source.sname, source.sname, prev),
						'CDEF:%s_plot=%s_avg,%s_stk,+'.format(source.sname, source.sname, prev)
					);
				else
					_args.push(
						'CDEF:%s_stk=%s_nnl,%s_stk,+'.format(source.sname, source.sname, prev),
						'CDEF:%s_plot=%s_max,%s_stk,+'.format(source.sname, source.sname, prev)
					);
			}

			/* create multiply by minus one cdef if flip is enabled */
			if (source.flip) {
				_args.push('CDEF:%s_neg=%s_plot,-1,*'.format(source.sname, source.sname));

				/* push to negative stack if overlay is disabled */
				if (!source.overlay)
					_stack_neg.push(source.sname);
			}

			/* no flipping, push to positive stack if overlay is disabled */
			else if (!source.overlay) {
				/* push to positive stack */
				_stack_pos.push(source.sname);
			}

			/* calculate total amount of data if requested */
			if (source.total)
				_args.push(
					'CDEF:%s_avg_sample=%s_avg,UN,0,%s_avg,IF,sample_len,*'.format(source.sname, source.sname, source.sname),
					'CDEF:%s_avg_sum=PREV,UN,0,PREV,IF,%s_avg_sample,+'.format(source.sname, source.sname, source.sname)
				);
		}

		/* local helper: create cdefs required for calculating total values */
		function __cdef_totals() {
			if (_has_totals)
				_args.push(
					'CDEF:mytime=%s_avg,TIME,TIME,IF'.format(_sources[0].sname),
					'CDEF:sample_len_raw=mytime,PREV(mytime),-',
					'CDEF:sample_len=sample_len_raw,UN,0,sample_len_raw,IF'
				);
		}

		/* local helper: create line and area statements */
		function __line(source) {
			var line_color, area_color, legend, variable;

			/* find colors: try source, then opts.colors; fall back to random color */
			if (typeof(source.color) == 'string') {
				line_color = source.color;
				area_color = colors.fromString(line_color);
			}
			else if (typeof(opts.colors[source.name.replace(/\W/g, '_')]) == 'string') {
				line_color = opts.colors[source.name.replace(/\W/g, '_')];
				area_color = colors.fromString(line_color);
			}
			else {
				area_color = colors.random();
				line_color = colors.asString(area_color);
			}

			/* derive area background color from line color */
			area_color = colors.asString(colors.faded(area_color));

			/* choose source_plot or source_neg variable depending on flip state */
			variable = source.flip ? 'neg' : 'plot';

			/* create legend */
			legend = '%%-%us'.format(_longest_name).format(source.title);

			/* create area is not disabled */
			if (!source.noarea)
				_args.push('AREA:%s_%s#%s'.format(source.sname, variable, area_color));

			/* create line statement */
			_args.push('LINE%d:%s_%s#%s:%s'.format(
				source.width || (source.noarea ? 2 : 1),
				source.sname, variable, line_color, legend
			));
		}

		/* local helper: create gprint statements */
		function __gprint(source) {
			var numfmt = opts.number_format || '%6.1lf',
			    totfmt = opts.totals_format || '%5.1lf%s';

			/* don't include MIN if rrasingle is enabled */
			if (!gopts.rrasingle)
				_args.push('GPRINT:%s_min:MIN:\tMin\\: %s'.format(source.sname, numfmt));

			/* don't include AVERAGE if noavg option is set */
			if (!source.noavg)
				_args.push('GPRINT:%s_avg:AVERAGE:\tAvg\\: %s'.format(source.sname, numfmt));

			/* don't include MAX if rrasingle is enabled */
			if (!gopts.rrasingle)
				_args.push('GPRINT:%s_max:MAX:\tMax\\: %s'.format(source.sname, numfmt));

			/* include total count if requested else include LAST */
			if (source.total)
				_args.push('GPRINT:%s_avg_sum:LAST:(ca. %s Total)\\l'.format(source.sname, totfmt));
			else
				_args.push('GPRINT:%s_avg:LAST:\tLast\\: %s\\l'.format(source.sname, numfmt));
		}

		/*
		 * find all data sources
		 */

		/* find data types */
		var data_types = dtype ? [ dtype ] : (opts.data.types || []);

		if (!(dtype || opts.data.types)) {
			if (L.isObject(opts.data.instances))
				data_types.push.apply(data_types, Object.keys(opts.data.instances));
			else if (L.isObject(opts.data.sources))
				data_types.push.apply(data_types, Object.keys(opts.data.sources));

		}

		/* iterate over data types */
		for (var i = 0; i < data_types.length; i++) {
			/* find instances */
			var data_instances;

			if (!opts.per_instance) {
				if (L.isObject(opts.data.instances) && Array.isArray(opts.data.instances[data_types[i]]))
					data_instances = opts.data.instances[data_types[i]];
				else
					data_instances = this.dataInstances(host, plugin, plugin_instance, data_types[i]);
			}

			if (!Array.isArray(data_instances) || data_instances.length == 0)
				data_instances = [ '' ];

			/* iterate over data instances */
			for (var j = 0; j < data_instances.length; j++) {
				/* construct combined data type / instance name */
				var dname = data_types[i];

				if (data_instances[j].length)
					dname += '_' + data_instances[j];

				/* find sources */
				var data_sources = [ 'value' ];

				if (L.isObject(opts.data.sources)) {
					if (Array.isArray(opts.data.sources[dname]))
						data_sources = opts.data.sources[dname];
					else if (Array.isArray(opts.data.sources[data_types[i]]))
						data_sources = opts.data.sources[data_types[i]];
				}

				/* iterate over data sources */
				for (var k = 0; k < data_sources.length; k++) {
					var dsname  = data_types[i] + '_' + data_instances[j].replace(/\W/g, '_') + '_' + data_sources[k],
					    altname = data_types[i] + '__' + data_sources[k];

					/* find datasource options */
					var dopts = {};

					if (L.isObject(opts.data.options)) {
						if (L.isObject(opts.data.options[dsname]))
							dopts = opts.data.options[dsname];
						else if (L.isObject(opts.data.options[altname]))
							dopts = opts.data.options[altname];
						else if (L.isObject(opts.data.options[dname]))
							dopts = opts.data.options[dname];
						else if (L.isObject(opts.data.options[data_types[i]]))
							dopts = opts.data.options[data_types[i]];
					}

					/* store values */
					var source = {
						rrd: dopts.rrd || this.mkrrdpath(host, plugin, plugin_instance, data_types[i], data_instances[j]),
						color: dopts.color || colors.asString(colors.random()),
						flip: dopts.flip || false,
						total: dopts.total || false,
						overlay: dopts.overlay || false,
						transform_rpn: dopts.transform_rpn || '0,+',
						noarea: dopts.noarea || false,
						noavg: dopts.noavg || false,
						title: dopts.title || null,
						weight: dopts.weight || (dopts.negweight ? -+data_instances[j] : null) || (dopts.posweight ? +data_instances[j] : null) || null,
						ds: data_sources[k],
						type: data_types[i],
						instance: data_instances[j],
						index: _sources.length + 1,
						sname: String(_sources.length + 1) + data_types[i]
					};

					_sources.push(source);

					/* generate datasource title */
					source.title = i18n.ds(host, source);

					/* find longest name */
					_longest_name = Math.max(_longest_name, source.title.length);

					/* has totals? */
					if (source.total)
						_has_totals = true;
				}
			}
		}

		/*
		 * construct diagrams
		 */

		/* if per_instance is enabled then find all instances from the first datasource in diagram */
		/* if per_instance is disabled then use an empty pseudo instance and use model provided values */
		var instances = [ '' ];

		if (opts.per_instance)
			instances = this.dataInstances(host, plugin, plugin_instance, _sources[0].type);

		/* iterate over instances */
		for (var i = 0; i < instances.length; i++) {
			/* store title and vlabel */
			_args.push(
				'-t', i18n.title(host, plugin, plugin_instance, _sources[0].type, instances[i], opts.title),
				'-v', i18n.label(host, plugin, plugin_instance, _sources[0].type, instances[i], opts.vlabel)
			);

			if (opts.y_max)
				_args.push('-u', String(opts.y_max));

			if (opts.y_min)
				_args.push('-l', String(opts.y_min));

			if (opts.units_exponent)
				_args.push('-X', String(opts.units_exponent));

			if (opts.alt_autoscale)
				_args.push('-A');

			if (opts.alt_autoscale_max)
				_args.push('-M');

			/* store additional rrd options */
			if (Array.isArray(opts.rrdopts))
				for (var j = 0; j < opts.rrdopts.length; j++)
					_args.push(String(opts.rrdopts[j]));

			/* sort sources */
			_sources.sort(function(a, b) {
				var x = a.weight || a.index || 0,
				    y = b.weight || b.index || 0;

				return +x - +y;
			});

			/* define colors in order */
			if (opts.ordercolor)
				for (var j = 0; j < _sources.length; j++)
					_sources[j].color = colors.defined(j);

			/* create DEF statements for each instance */
			for (var j = 0; j < _sources.length; j++) {
				/* fixup properties for per instance mode... */
				if (opts.per_instance) {
					_sources[j].instance = instances[i];
					_sources[j].rrd      = this.mkrrdpath(host, plugin, plugin_instance, _sources[j].type, instances[i]);
				}

				__def(_sources[j]);
			}

			/* create CDEF required for calculating totals */
			__cdef_totals();

			/* create CDEF statements for each instance in reversed order */
			for (var j = _sources.length - 1; j >= 0; j--)
				__cdef(_sources[j]);

			/* create LINE1, AREA and GPRINT statements for each instance */
			for (var j = 0; j < _sources.length; j++) {
				__line(_sources[j]);
				__gprint(_sources[j]);
			}

			/* push arg stack to definition list */
			defs.push(_args);

			/* reset stacks */
			_args = [];
			_stack_pos = [];
			_stack_neg = [];
		}

		return defs;
	},

}
