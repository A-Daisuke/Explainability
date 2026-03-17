function __method_wrapper__() {
			.map(function (col) {
				var colexp = col.expression.toJS('p', tableid, defcols);
				var colas = col.nick;
				let colExpIfFunIdExists = expression => {
					let colexpression = expression.args[0];
					return colexpression.toJS('p', tableid, defcols);
				};
				if (col instanceof yy.AggrValue) {
					if (col.distinct) {
						aft +=
							",g['$$_VALUES_" + colas + "']={},g['$$_VALUES_" + colas + "'][" + colexp + ']=true';
					}
					if (col.aggregatorid === 'SUM') {
						if ('funcid' in col.expression) {
							let colexp1 = colExpIfFunIdExists(col.expression);
							return `'${colas}':(${colexp1})|| typeof ${colexp1} == 'number' ? ${colexp} : null,`;
						}
						return `'${colas}':(${colexp})|| typeof ${colexp} == 'number' ? ${colexp} : null,`;
					} else if (col.aggregatorid === 'TOTAL') {
						if ('funcid' in col.expression) {
							let colexp1 = colExpIfFunIdExists(col.expression);
							return `'${colas}':(${colexp1}) || typeof ${colexp1} == 'number' ?
							${colexp1} : ${colexp1} == 'string' && typeof Number(${colexp1}) == 'number' ? Number(${colexp1}) :
							typeof ${colexp1} == 'boolean' ?  Number(${colexp1}) : 0,`;
						}
						return `'${colas}':(${colexp})|| typeof ${colexp} == 'number' ?
							${colexp} : ${colexp} == 'string' && typeof Number(${colexp}) == 'number' ? Number(${colexp}) :
							typeof ${colexp} === 'boolean' ?  Number(${colexp}) : 0,`;
					} else if (col.aggregatorid === 'FIRST' || col.aggregatorid === 'LAST') {
						return "'" + colas + "':" + colexp + ','; //f.field.arguments[0].toJS();
					} else if (col.aggregatorid === 'MIN') {
						if ('funcid' in col.expression) {
							let colexp1 = colExpIfFunIdExists(col.expression);

							return `'${colas}': (typeof ${colexp1} == 'number' || typeof ${colexp1} == 'bigint' ? ${colexp} : typeof ${colexp1} == 'object' ?
							typeof Number(${colexp1}) == 'number' && ${colexp1}!== null? ${colexp} : null : null),`;
						}
						return `'${colas}': (typeof ${colexp} == 'number' || typeof ${colexp} == 'bigint' ? ${colexp} : typeof ${colexp} == 'object' ?
							typeof Number(${colexp}) == 'number' && ${colexp}!== null? ${colexp} : null : null),`;
					} else if (col.aggregatorid === 'MAX') {
						if ('funcid' in col.expression) {
							let colexp1 = colExpIfFunIdExists(col.expression);
							return `'${colas}' : (typeof ${colexp1} == 'number' || typeof ${colexp1} == 'bigint' ? ${colexp} : typeof ${colexp1} == 'object' ?
							typeof Number(${colexp1}) == 'number' ? ${colexp} : null : null),`;
						}
						return `'${colas}' : (typeof ${colexp} == 'number' || typeof ${colexp} == 'bigint' ? ${colexp} : typeof ${colexp} == 'object' ?
							typeof Number(${colexp}) == 'number' ? ${colexp} : null : null),`;
					} else if (col.aggregatorid === 'ARRAY') {
						return `'${colas}':[${colexp}],`;
					} else if (col.aggregatorid === 'COUNT') {
						if (col.expression.columnid === '*') {
							return `'${colas}':1,`;
						} else {
							return `'${colas}':(typeof ${colexp} == "undefined" || ${colexp} === null) ? 0 : 1,`;
						}
					} else if (col.aggregatorid === 'AVG') {
						query.removeKeys.push(`_SUM_${colas}`);
						query.removeKeys.push(`_COUNT_${colas}`);

						return `'${colas}':${colexp},'_SUM_${colas}':(${colexp})||0,'_COUNT_${colas}':(typeof ${colexp} == "undefined" || ${colexp} === null) ? 0 : 1,`;
					} else if (col.aggregatorid === 'AGGR') {
						aft += `,g['${colas}']=${col.expression.toJS('g', -1)}`;
						return '';
					} else if (col.aggregatorid === 'REDUCE') {
						query.aggrKeys.push(col);
						return `'${colas}':alasql.aggr['${col.funcid}'](${colexp},undefined,1),`;
					}
					return '';
				}

				return '';
			})

}
