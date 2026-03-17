function __method_wrapper__() {
	this.columns.forEach(function (col) {
		if (col instanceof yy.Column) {
			if (col.columnid === '*') {
				if (col.func) {
					sp +=
						"r=params['" + col.param + "'](p['" + query.sources[0].alias + "'],p,params,alasql);";
				} else if (col.tableid) {
					//Copy all
					var ret = compileSelectStar(query, [col.tableid], false);
					if (ret.s) {
						ss = ss.concat(ret.s);
					}
					sp += ret.sp;
				} else {
					//					console.log('aliases', query.aliases);
					var ret = compileSelectStar(query, Object.keys(query.aliases), true); //query.aliases[alias].tableid);
					if (ret.s) {
						ss = ss.concat(ret.s);
					}
					sp += ret.sp;

					// TODO Remove these lines
					// In case of no information
					// sp += 'for(var k1 in p){var w=p[k1];'+
					// 			'for(k2 in w) {r[k2]=w[k2]}}'
				}
			} else {
				// If field, otherwise - expression
				var tbid = col.tableid;
				//				console.log(query.sources);
				var dbid = col.databaseid || query.sources[0].databaseid || query.database.databaseid;
				if (!tbid) tbid = query.defcols[col.columnid];
				if (!tbid) tbid = query.defaultTableid;
				if (col.columnid !== '_') {
					if (false && tbid && !query.defcols['.'][col.tableid] && !query.defcols[col.columnid]) {
						ss.push(
							"'" +
								escapeq(col.as || col.columnid) +
								"':p['" +
								query.defaultTableid +
								"']['" +
								col.tableid +
								"']['" +
								col.columnid +
								"']"
						);
					} else {
						// workaround for multisheet xlsx export with custom COLUMNS
						var isMultisheetParam =
							params &&
							params.length > 1 &&
							Array.isArray(params[0]) &&
							params[0].length >= 1 &&
							params[0][0].hasOwnProperty('sheetid');
						if (isMultisheetParam) {
							sp =
								'var r={};var w=p["' +
								tbid +
								'"];' +
								'var cols=[' +
								self.columns
									.map(function (col) {
										return "'" + col.columnid + "'";
									})
									.join(',') +
								'];var colas=[' +
								self.columns
									.map(function (col) {
										return "'" + (col.as || col.columnid) + "'";
									})
									.join(',') +
								'];' +
								"for (var i=0;i<Object.keys(p['" +
								tbid +
								"']).length;i++)" +
								' for(var k=0;k<cols.length;k++){if (!r.hasOwnProperty(i)) r[i]={}; r[i][colas[k]]=w[i][cols[k]];}';
						} else {
							ss.push(
								"'" +
									escapeq(col.as || col.columnid) +
									"':p['" +
									tbid +
									"']['" +
									col.columnid +
									"']"
							);
						}
					}
				} else {
					ss.push("'" + escapeq(col.as || col.columnid) + "':p['" + tbid + "']");
				}
				query.selectColumns[escapeq(col.as || col.columnid)] = true;

				if (query.aliases[tbid] && query.aliases[tbid].type === 'table') {
					if (!alasql.databases[dbid].tables[query.aliases[tbid].tableid]) {
						//						console.log(query.database,tbid,query.aliases[tbid].tableid);
						throw new Error("Table '" + tbid + "' does not exist in database");
					}
					var columns = alasql.databases[dbid].tables[query.aliases[tbid].tableid].columns;
					var xcolumns = alasql.databases[dbid].tables[query.aliases[tbid].tableid].xcolumns;
					//console.log(xcolumns, col,123);
					//					console.log(0);
					if (xcolumns && columns.length > 0) {
						//						console.log(1);
						var tcol = xcolumns[col.columnid];

						if (undefined === tcol) {
							throw new Error('Column does not exist: ' + col.columnid);
						}

						var coldef = {
							columnid: col.as || col.columnid,
							dbtypeid: tcol.dbtypeid,
							dbsize: tcol.dbsize,
							dbpecision: tcol.dbprecision,
							dbenum: tcol.dbenum,
						};
						//						console.log(2);
						query.columns.push(coldef);
						query.xcolumns[coldef.columnid] = coldef;
					} else {
						var coldef = {
							columnid: col.as || col.columnid,
							//							dbtypeid:tcol.dbtypeid,
							//							dbsize:tcol.dbsize,
							//							dbpecision:tcol.dbprecision,
							//							dbenum: tcol.dbenum,
						};
						//						console.log(2);
						query.columns.push(coldef);
						query.xcolumns[coldef.columnid] = coldef;

						query.dirtyColumns = true;
					}
				} else {
					var coldef = {
						columnid: col.as || col.columnid,
						//							dbtypeid:tcol.dbtypeid,
						//							dbsize:tcol.dbsize,
						//							dbpecision:tcol.dbprecision,
						//							dbenum: tcol.dbenum,
					};
					//						console.log(2);
					query.columns.push(coldef);
					query.xcolumns[coldef.columnid] = coldef;
					// This is a subquery?
					// throw new Error('There is now such table \''+col.tableid+'\'');
				}
			}
		} else if (col instanceof yy.AggrValue) {
			if (!self.group) {
				//				self.group=[new yy.Column({columnid:'q',as:'q'	})];
				self.group = [''];
			}
			if (!col.as) {
				col.as = escapeq(col.toString());
			}

			if (
				col.aggregatorid === 'SUM' ||
				col.aggregatorid === 'MAX' ||
				col.aggregatorid === 'MIN' ||
				col.aggregatorid === 'FIRST' ||
				col.aggregatorid === 'LAST' ||
				col.aggregatorid === 'AVG' ||
				col.aggregatorid === 'ARRAY' ||
				col.aggregatorid === 'REDUCE' ||
				col.aggregatorid === 'TOTAL'
			) {
				ss.push(
					"'" +
						escapeq(col.as) +
						"':" +
						n2u(col.expression.toJS('p', query.defaultTableid, query.defcols))
				);
			} else if (col.aggregatorid === 'COUNT') {
				ss.push("'" + escapeq(col.as) + "':1");
				// Nothing
			}
			// todo: confirm that no default action must be implemented

			//			query.selectColumns[col.aggregatorid+'('+escapeq(col.expression.toString())+')'] = thtd;

			var coldef = {
				columnid: col.as || col.columnid || col.toString(),
				//							dbtypeid:tcol.dbtypeid,
				//							dbsize:tcol.dbsize,
				//							dbpecision:tcol.dbprecision,
				//							dbenum: tcol.dbenum,
			};
			//						console.log(2);
			query.columns.push(coldef);
			query.xcolumns[coldef.columnid] = coldef;

			//			else if (col.aggregatorid == 'MAX') {
			//				ss.push((col.as || col.columnid)+':'+col.toJS("p.",query.defaultTableid))
			//			} else if (col.aggregatorid == 'MIN') {
			//				ss.push((col.as || col.columnid)+':'+col.toJS("p.",query.defaultTableid))
			//			}
		} else {
			//			console.log(203,col.as,col.columnid,col.toString());
			ss.push(
				"'" +
					escapeq(col.as || col.columnid || col.toString()) +
					"':" +
					n2u(col.toJS('p', query.defaultTableid, query.defcols))
			);
			//			ss.push('\''+escapeq(col.toString())+'\':'+col.toJS("p",query.defaultTableid));
			//if(col instanceof yy.Expression) {
			query.selectColumns[escapeq(col.as || col.columnid || col.toString())] = true;

			var coldef = {
				columnid: col.as || col.columnid || col.toString(),
				//							dbtypeid:tcol.dbtypeid,
				//							dbsize:tcol.dbsize,
				//							dbpecision:tcol.dbprecision,
				//							dbenum: tcol.dbenum,
			};
			//						console.log(2);
			query.columns.push(coldef);
			query.xcolumns[coldef.columnid] = coldef;
		}
	});

}
