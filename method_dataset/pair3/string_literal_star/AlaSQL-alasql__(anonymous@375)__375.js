function __method_wrapper__() {
	self.columns.forEach(function (col, idx) {
		if (!(col instanceof yy.Column && col.columnid === '*')) {
			var colas;
			//  = col.as;
			if (col instanceof yy.Column) {
				colas = escapeq(col.columnid);
			} else {
				colas = escapeq(col.toString(true));
				//				console.log(273,colas);
			}
			for (var i = 0; i < idx; i++) {
				if (colas === self.columns[i].nick) {
					colas = self.columns[i].nick + ':' + idx;
					break;
				}
			}
			// }
			col.nick = colas;

			if (self.group) {
				var groupIdx = self.group.findIndex(function (gp) {
					return gp.columnid === col.columnid && gp.tableid === col.tableid;
				});
				if (groupIdx > -1) {
					self.group[groupIdx].nick = colas;
				}
			}

			if (
				col.funcid &&
				(col.funcid.toUpperCase() === 'ROWNUM' || col.funcid.toUpperCase() === 'ROW_NUMBER')
			) {
				query.rownums.push(col.as);
			}
			//				console.log("colas:",colas);
			// }
		} else {
			query.groupStar = col.tableid || 'default';
		}
	});

}
