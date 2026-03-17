function __method_wrapper__() {
	self.columns.forEach(function (col) {
		//		console.log(col);
		if (col instanceof yy.Column && col.columnid === '*') {
			//			s += 'for(var k in g){r[k]=g[k]};';
			//			s += 'for(var k in this.query.groupColumns){r[k]=g[this.query.groupColumns[k]]};';

			s += 'for(var k in g) {r[k]=g[k]};';
			return '';

			//			console.log(query);
		} else {
			// var colas = col.as;
			var colas = col.as;
			if (colas === undefined) {
				if (col instanceof yy.Column) {
					colas = escapeq(col.columnid);
				} else {
					colas = col.nick;
				}
			}
			query.groupColumns[colas] = col.nick;

			/*/*			if(typeof colas == 'undefined') {
				if(col instanceof yy.Column) {
					colas = col.columnid;
				} else {
					colas = col.toString();
					for(var i=0;i<idx;i++) {
						if(colas == self.columns[i].as) {
							colas = self.columns[i].as+':'+idx;
							break;
						}
					}
					col.as = colas;
				}
			}
*/
			//			if(col.as) {
			s += "r['" + colas + "']=";
			//			// } else {
			//			// 	s += 'r[\''+escapeq()+'\']=';
			//			// };
			//			// s += ';';
			//			console.log(col);//,col.toJS('g',''));

			s += n2u(col.toJS('g', '')) + ';';
			/*/*
			s += 'g[\''+col.nick+'\'];';

* /
			// if(col instanceof yy.Column) {
			// 	s += 'g[\''+col.columnid+'\'];';
			// } else {
//				s += 'g[\''+col.toString()+'\'];';

//				console.log(col);
				// var kg = col.toJS('g','')+';';
				// for(var i=0;i<query.removeKeys.length;i++) {
				// 	// THis part should be intellectual
				// 	if(query.removeKeys[i] == colas) {
				// s += 'g[\''+colas+'\'];';
				// 		break;
				// 	}
				// };
				// s += kg;
//				console.log(s);
			// }
//			s += col.toJS('g','')+';';
*/
			//console.log(colas,query.removeKeys);
			for (var i = 0; i < query.removeKeys.length; i++) {
				// THis part should be intellectual
				if (query.removeKeys[i] === colas) {
					query.removeKeys.splice(i, 1);
					break;
				}
			}
		}
	});

}
