const __obj__ = {
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

			if (alasql.options.casesensitive) this.$ = $$[$0];
			else this.$ = $$[$0].toLowerCase();
		
break;
case 2:
 this.$ = doubleq($$[$0].substr(1,$$[$0].length-2)); 
break;
case 3:
 this.$ = $$[$0].toLowerCase() 
break;
case 4:
 this.$ = $$[$0] 
break;
case 5:
 this.$ = $$[$0] ? $$[$0-1] + ' ' + $$[$0] : $$[$0-1] 
break;
case 6:
 return new yy.Statements({statements:$$[$0-1]}); 
break;
case 7:
 this.$ = $$[$0-2]; if($$[$0]) $$[$0-2].push($$[$0]); 
break;
case 8: case 9: case 70: case 80: case 85: case 143: case 177: case 205: case 206: case 243: case 262: case 277: case 363: case 381: case 460: case 483: case 484: case 488: case 496: case 537: case 538: case 575: case 658: case 668: case 692: case 694: case 696: case 711: case 712: case 742: case 766:
 this.$ = [$$[$0]]; 
break;
case 10:
 this.$ = $$[$0]; $$[$0].explain = true; 
break;
case 11:
 this.$ = $$[$0];  $$[$0].explain = true;
break;
case 12:

			this.$ = $$[$0];

			// TODO combine exists and queries
		    if(yy.exists) this.$.exists = yy.exists;
		    delete yy.exists;
		    if(yy.queries) this.$.queries = yy.queries;
			delete yy.queries;
		
break;
case 13: case 162: case 172: case 238: case 239: case 241: case 249: case 251: case 260: case 271: case 274: case 384: case 500: case 510: case 512: case 524: case 530: case 531: case 576:
 this.$ = undefined; 
break;
case 68:
 this.$ = new yy.WithSelect({withs: $$[$0-1], select:$$[$0]}); 
break;
case 69: case 574:
 $$[$0-2].push($$[$0]); this.$=$$[$0-2]; 
break;
case 71:
 this.$ = {name:$$[$0-4], select:$$[$0-1]}; 
break;
case 72:

			yy.extend(this.$,$$[$0-9]); yy.extend(this.$,$$[$0-8]); yy.extend(this.$,$$[$0-7]); yy.extend(this.$,$$[$0-6]);
		    yy.extend(this.$,$$[$0-5]); yy.extend(this.$,$$[$0-4]);yy.extend(this.$,$$[$0-3]);
		    yy.extend(this.$,$$[$0-2]); yy.extend(this.$,$$[$0-1]); yy.extend(this.$,$$[$0]);
		    this.$ = $$[$0-9];
		    if(yy.exists) this.$.exists = yy.exists.slice();
/*		    if(yy.queries) this.$.queries = yy.queries;
			delete yy.queries;
*/		
break;
case 73:

			this.$ = new yy.Search({selectors:$$[$0-2], from:$$[$0]});
			yy.extend(this.$,$$[$0-1]);
		
break;
case 74:
 this.$ = {pivot:{expr:$$[$0-5], columnid:$$[$0-3], inlist:$$[$0-2], as:$$[$0]}}; 
break;
case 75:
 this.$ = {unpivot:{tocolumnid:$$[$0-8], forcolumnid:$$[$0-6], inlist:$$[$0-3], as:$$[$0]}}; 
break;
case 76: case 529: case 558: case 594: case 628: case 645: case 646: case 649: case 671:
 this.$ = $$[$0-1]; 
break;
case 77: case 78: case 86: case 147: case 185: case 248: case 284: case 292: case 293: case 294: case 295: case 296: case 297: case 298: case 299: case 300: case 301: case 302: case 303: case 304: case 305: case 308: case 309: case 325: case 326: case 327: case 328: case 329: case 330: case 383: case 449: case 450: case 451: case 452: case 453: case 454: case 525: case 551: case 555: case 557: case 632: case 633: case 634: case 635: case 636: case 637: case 641: case 643: case 644: case 653: case 669: case 670: case 733: case 748: case 749: case 751: case 752: case 758: case 759:
 this.$ = $$[$0]; 
break;
case 79: case 84: case 741: case 765:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 81:
 this.$ = {expr:$$[$0]}; 
break;
case 82:
 this.$ = {expr:$$[$0-2],as:$$[$0]}; 
break;
case 83:
 this.$ = {removecolumns:$$[$0]}; 
break;
case 87:
 this.$ = {like:$$[$0]}; 
break;
case 90: case 104:
 this.$ = {srchid:"PROP", args: [$$[$0]]}; 
break;
case 91:
 this.$ = {srchid:"ORDERBY", args: $$[$0-1]}; 
break;
case 92:

			var dir = $$[$0-1];
			if(!dir) dir = 'ASC';
			this.$ = {srchid:"ORDERBY", args: [{expression: new yy.Column({columnid:'_'}), direction:dir}]};
		
break;
case 93:
 this.$ = {srchid:"PARENT"}; 
break;
case 94:
 this.$ = {srchid:"APROP", args: [$$[$0]]}; 
break;
case 95:
 this.$ = {selid:"ROOT"};
break;
case 96:
 this.$ = {srchid:"EQ", args: [$$[$0]]}; 
break;
case 97:
 this.$ = {srchid:"LIKE", args: [$$[$0]]}; 
break;
case 98: case 99:
 this.$ = {selid:"WITH", args: $$[$0-1]}; 
break;
case 100:
 this.$ = {srchid:$$[$0-3].toUpperCase(), args:$$[$0-1]}; 
break;
case 101:
 this.$ = {srchid:"WHERE", args:[$$[$0-1]]}; 
break;
case 102:
 this.$ = {selid:"OF", args:[$$[$0-1]]}; 
break;
case 103:
 this.$ = {srchid:"CLASS", args:[$$[$0-1]]}; 
break;
case 105:
 this.$ = {srchid:"NAME", args: [$$[$0].substr(1,$$[$0].length-2)]}; 
break;
case 106:
 this.$ = {srchid:"CHILD"}; 
break;
case 107:
 this.$ = {srchid:"VERTEX"}; 
break;
case 108:
 this.$ = {srchid:"EDGE"}; 
break;
case 109:
 this.$ = {srchid:"REF"}; 
break;
case 110:
 this.$ = {srchid:"SHARP", args:[$$[$0]]}; 
break;
case 111:
 this.$ = {srchid:"ATTR", args:((typeof $$[$0] == 'undefined')?undefined:[$$[$0]])}; 
break;
case 112:
 this.$ = {srchid:"ATTR"}; 
break;
case 113:
 this.$ = {srchid:"OUT"}; 
break;
case 114:
 this.$ = {srchid:"IN"}; 
break;
case 115:
 this.$ = {srchid:"OUTOUT"}; 
break;
case 116:
 this.$ = {srchid:"ININ"}; 
break;
case 117:
 this.$ = {srchid:"CONTENT"}; 
break;
case 118:
 this.$ = {srchid:"EX",args:[new yy.Json({value:$$[$0]})]}; 
break;
case 119:
 this.$ = {srchid:"AT", args:[$$[$0]]}; 
break;
case 120:
 this.$ = {srchid:"AS", args:[$$[$0]]}; 
break;
case 121:
 this.$ = {srchid:"SET", args:$$[$0-1]}; 
break;
case 122:
 this.$ = {selid:"TO", args:[$$[$0]]}; 
break;
case 123:
 this.$ = {srchid:"VALUE"}; 
break;
case 124:
 this.$ = {srchid:"ROW", args:$$[$0-1]}; 
break;
case 125:
 this.$ = {srchid:"CLASS", args:[$$[$0]]}; 
break;
case 126:
 this.$ = {selid:$$[$0],args:[$$[$0-1]] }; 
break;
case 127:
 this.$ = {selid:"NOT",args:$$[$0-1] }; 
break;
case 128:
 this.$ = {selid:"IF",args:$$[$0-1] }; 
break;
case 129:
 this.$ = {selid:$$[$0-3],args:$$[$0-1] }; 
break;
case 130:
 this.$ = {selid:'DISTINCT',args:$$[$0-1] }; 
break;
case 131:
 this.$ = {selid:'UNION',args:$$[$0-1] }; 
break;
case 132:
 this.$ = {selid:'UNIONALL',args:$$[$0-1] }; 
break;
case 133:
 this.$ = {selid:'ALL',args:[$$[$0-1]] }; 
break;
case 134:
 this.$ = {selid:'ANY',args:[$$[$0-1]] }; 
break;
case 135:
 this.$ = {selid:'INTERSECT',args:$$[$0-1] }; 
break;
case 136:
 this.$ = {selid:'EXCEPT',args:$$[$0-1] }; 
break;
case 137:
 this.$ = {selid:'AND',args:$$[$0-1] }; 
break;
case 138:
 this.$ = {selid:'OR',args:$$[$0-1] }; 
break;
case 139:
 this.$ = {selid:'PATH',args:[$$[$0-1]] }; 
break;
case 140:
 this.$ = {srchid:'RETURN',args:$$[$0-1] }; 
break;
case 141:
 this.$ = {selid:'REPEAT',sels:$$[$0-3], args:$$[$0-1] }; 
break;
case 142:
 this.$ = $$[$0-2]; this.$.push($$[$0]);
break;
case 144:
 this.$ = "PLUS"; 
break;
case 145:
 this.$ = "STAR"; 
break;
case 146:
 this.$ = "QUESTION"; 
break;
case 148:
 this.$ = new yy.Select({ columns:$$[$0], distinct: true }); yy.extend(this.$, $$[$0-3]); yy.extend(this.$, $$[$0-1]); 
break;
case 149:
 this.$ = new yy.Select({ columns:$$[$0], distinct: true }); yy.extend(this.$, $$[$0-3]);yy.extend(this.$, $$[$0-1]); 
break;
case 150:
 this.$ = new yy.Select({ columns:$$[$0], all:true }); yy.extend(this.$, $$[$0-3]);yy.extend(this.$, $$[$0-1]); 
break;
case 151:

			if(!$$[$0]) {
				this.$ = new yy.Select({columns:[new yy.Column({columnid:'_',})], modifier:'COLUMN'});
			} else {
				this.$ = new yy.Select({ columns:$$[$0] }); yy.extend(this.$, $$[$0-2]);yy.extend(this.$, $$[$0-1]);
			}
		
break;
case 152:
 if($$[$0]=='SELECT') this.$ = undefined; else this.$ = {modifier: $$[$0]};  
break;
case 153:
 this.$ = {modifier:'VALUE'}
break;
case 154:
 this.$ = {modifier:'ROW'}
break;
case 155:
 this.$ = {modifier:'COLUMN'}
break;
case 156:
 this.$ = {modifier:'MATRIX'}
break;
case 157:
 this.$ = {modifier:'TEXTSTRING'}
break;
case 158:
 this.$ = {modifier:'INDEX'}
break;
case 159:
 this.$ = {modifier:'RECORDSET'}
break;
case 160:
 this.$ = {top: $$[$0-1], percent:(typeof $$[$0] != 'undefined'?true:undefined)}; 
break;
case 161:
 this.$ = {top: $$[$0-1]}; 
break;
case 163: case 336: case 532: case 533: case 734:
this.$ = undefined; 
break;
case 164: case 165: case 166: case 167:
this.$ = {into: $$[$0]} 
break;
case 168:

			var s = $$[$0];
			s = s.substr(1,s.length-2);
			var x3 = s.substr(-3).toUpperCase();
			var x4 = s.substr(-4).toUpperCase();
			if(s[0] == '#') {
				this.$ = {into: new yy.FuncValue({funcid: 'HTML', args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]})};
			} else if(x3=='XLS' || x3 == 'CSV' || x3=='TAB') {
				this.$ = {into: new yy.FuncValue({funcid: x3, args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]})};
			} else if(x4=='XLSX' || x4 == 'JSON') {
				this.$ = {into: new yy.FuncValue({funcid: x4, args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]})};
			}
		
break;
case 169:
 this.$ = { from: $$[$0] }; 
break;
case 170:
 this.$ = { from: $$[$0-1], joins: $$[$0] }; 
break;
case 171:
 this.$ = { from: $$[$0-2], joins: $$[$0-1] }; 
break;
case 173:
 this.$ = new yy.Apply({select: $$[$0-2], applymode:'CROSS', as:$$[$0]}); 
break;
case 174:
 this.$ = new yy.Apply({select: $$[$0-3], applymode:'CROSS', as:$$[$0]}); 
break;
case 175:
 this.$ = new yy.Apply({select: $$[$0-2], applymode:'OUTER', as:$$[$0]}); 
break;
case 176:
 this.$ = new yy.Apply({select: $$[$0-3], applymode:'OUTER', as:$$[$0]}); 
break;
case 178: case 244: case 461: case 539: case 540:
 this.$ = $$[$0-2]; $$[$0-2].push($$[$0]); 
break;
case 179:
 this.$ = $$[$0-2]; this.$.as = $$[$0] 
break;
case 180:
 this.$ = $$[$0-3]; this.$.as = $$[$0] 
break;
case 181:
 this.$ = $$[$0-1]; this.$.as = 'default' 
break;
case 182:
 this.$ = new yy.Json({value:$$[$0-2]}); $$[$0-2].as = $$[$0] 
break;
case 183:
 this.$ = $$[$0-1]; $$[$0-1].as = $$[$0] 
break;
case 184:
 this.$ = $$[$0-2]; $$[$0-2].as = $$[$0] 
break;
case 186: case 647: case 650:
 this.$ = $$[$0-2]; 
break;
case 187: case 191: case 195: case 198:
 this.$ = $$[$0-1]; $$[$0-1].as = $$[$0]; 
break;
case 188: case 192: case 196: case 199:
 this.$ = $$[$0-2]; $$[$0-2].as = $$[$0]; 
break;
case 189: case 190: case 194: case 197:
 this.$ = $$[$0]; $$[$0].as = 'default'; 
break;
case 193:
 this.$ = {inserted:true}; 
break;
case 200:

			var s = $$[$0];
			s = s.substr(1,s.length-2);
			var x3 = s.substr(-3).toUpperCase();
			var x4 = s.substr(-4).toUpperCase();
			var r;
			if(s[0] == '#') {
				r = new yy.FuncValue({funcid: 'HTML', args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]});
			} else if(x3=='XLS' || x3 == 'CSV' || x3=='TAB') {
				r = new yy.FuncValue({funcid: x3, args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]});
			} else if(x4=='XLSX' || x4 == 'JSON') {
				r = new yy.FuncValue({funcid: x4, args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]});
			} else {
				throw new Error('Unknown string in FROM clause');
			};
			this.$ = r;
		
break;
case 201:

			if($$[$0-2] == 'INFORMATION_SCHEMA') {
				this.$ = new yy.FuncValue({funcid: $$[$0-2], args:[new yy.StringValue({value:$$[$0]})]});
			} else {
				this.$ = new yy.Table({databaseid: $$[$0-2], tableid:$$[$0]});
			}
		
break;
case 202:
 this.$ = new yy.Table({tableid: $$[$0]});
break;
case 203: case 204:
 this.$ = $$[$0-1]; $$[$0-1].push($$[$0]); 
break;
case 207:
 this.$ = new yy.Join($$[$0-2]); yy.extend(this.$, $$[$0-1]); yy.extend(this.$, $$[$0]); 
break;
case 208:
 this.$ = {table: $$[$0]}; 
break;
case 209:
 this.$ = {table: $$[$0-1], as: $$[$0] } ; 
break;
case 210:
 this.$ = {table: $$[$0-2], as: $$[$0] } ; 
break;
case 211:
 this.$ = {json:new yy.Json({value:$$[$0-2],as:$$[$0]})}; 
break;
case 212:
 this.$ = {param: $$[$0-1], as: $$[$0] } ; 
break;
case 213:
 this.$ = {param: $$[$0-2], as: $$[$0] } ; 
break;
case 214:
 this.$ = {select: $$[$0-2], as: $$[$0]} ; 
break;
case 215:
 this.$ = {select: $$[$0-3], as: $$[$0] } ; 
break;
case 216:
 this.$ = {func:$$[$0], as:'default'}; 
break;
case 217:
 this.$ = {func:$$[$0-1], as: $$[$0]}; 
break;
case 218:
 this.$ = {func:$$[$0-2], as: $$[$0]}; 
break;
case 219:
 this.$ = {variable:$$[$0],as:'default'}; 
break;
case 220:
 this.$ = {variable:$$[$0-1],as:$$[$0]}; 
break;
case 221:
 this.$ = {variable:$$[$0-2],as:$$[$0]} 
break;
case 222:
 this.$ = { joinmode: $$[$0] } ; 
break;
case 223:
 this.$ = {joinmode: $$[$0-1], natural:true} ; 
break;
case 224: case 225:
 this.$ = "INNER"; 
break;
case 226: case 227:
 this.$ = "LEFT"; 
break;
case 228: case 229:
 this.$ = "RIGHT"; 
break;
case 230: case 231:
 this.$ = "OUTER"; 
break;
case 232:
 this.$ = "SEMI"; 
break;
case 233:
 this.$ = "ANTI"; 
break;
case 234:
 this.$ = "CROSS"; 
break;
case 235:
 this.$ = {on: $$[$0]}; 
break;
case 236: case 706:
 this.$ = {using: $$[$0]}; 
break;
case 237: case 707:
 this.$ = {using: $$[$0-1]}; 
break;
case 240:
 this.$ = {where: new yy.Expression({expression:$$[$0]})}; 
break;
case 242:
 this.$ = {group:$$[$0-1]}; yy.extend(this.$,$$[$0]); 
break;
case 245:
 this.$ = new yy.GroupExpression({type:'GROUPING SETS', group: $$[$0-1]}); 
break;
case 246:
 this.$ = new yy.GroupExpression({type:'ROLLUP', group: $$[$0-1]}); 
break;
case 247:
 this.$ = new yy.GroupExpression({type:'CUBE', group: $$[$0-1]}); 
break;
case 250:
 this.$ = {having:$$[$0]}
break;
case 252:
 this.$ = {union: $$[$0]} ; 
break;
case 253:
 this.$ = {unionall: $$[$0]} ; 
break;
case 254:
 this.$ = {except: $$[$0]} ; 
break;
case 255:
 this.$ = {intersect: $$[$0]} ; 
break;
case 256:
 this.$ = {union: $$[$0], corresponding:true} ; 
break;
case 257:
 this.$ = {unionall: $$[$0], corresponding:true} ; 
break;
case 258:
 this.$ = {except: $$[$0], corresponding:true} ; 
break;
case 259:
 this.$ = {intersect: $$[$0], corresponding:true} ; 
break;
case 261:
 this.$ = {order:$$[$0]}
break;
case 263:
 this.$ = $$[$0-2]; $$[$0-2].push($$[$0])
break;
case 264:
 this.$ = {nullsOrder: 'FIRST'}; 
break;
case 265:
 this.$ = {nullsOrder: 'LAST'}; 
break;
case 266:
 this.$ = new yy.Expression({expression: $$[$0], direction:'ASC'}) 
break;
case 267:
 this.$ = new yy.Expression({expression: $$[$0-1], direction:$$[$0].toUpperCase()}) 
break;
case 268:
 this.$ = new yy.Expression({expression: $$[$0-2], direction:$$[$0-1].toUpperCase()}); yy.extend(this.$, $$[$0]) 
break;
case 269:
 this.$ = new yy.Expression({expression: $$[$0-2], direction:'ASC', nocase:true}) 
break;
case 270:
 this.$ = new yy.Expression({expression: $$[$0-3], direction:$$[$0].toUpperCase(), nocase:true}) 
break;
case 272:
 this.$ = {limit:$$[$0-1]}; yy.extend(this.$, $$[$0]); 
break;
case 273:
 this.$ = {limit:$$[$0-2],offset:$$[$0-6]}; 
break;
case 275:
 this.$ = {offset:$$[$0]}; 
break;
case 276: case 518: case 542: case 657: case 667: case 691: case 693: case 697:
 $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 278: case 280: case 282:
 $$[$0-2].as = $$[$0]; this.$ = $$[$0-2];
break;
case 279: case 281: case 283:
 $$[$0-1].as = $$[$0]; this.$ = $$[$0-1];
break;
case 285:
 this.$ = new yy.Column({columid: $$[$0], tableid: $$[$0-2], databaseid:$$[$0-4]}); 
break;
case 286:
 this.$ = new yy.Column({columnid: $$[$0], tableid: $$[$0-2]}); 
break;
case 287:
 this.$ = new yy.Column({columnid:$$[$0]}); 
break;
case 288:
 this.$ = new yy.Column({columnid: $$[$0], tableid: $$[$0-2], databaseid:$$[$0-4]});
break;
case 289: case 290:
 this.$ = new yy.Column({columnid: $$[$0], tableid: $$[$0-2]});
break;
case 291:
 this.$ = new yy.Column({columnid: $$[$0]});
break;
case 306:
 this.$ = new yy.DomainValueValue(); 
break;
case 307:
 this.$ = new yy.Json({value:$$[$0]}); 
break;
case 310: case 311: case 312:

			if(!yy.queries) yy.queries = [];
			yy.queries.push($$[$0-1]);
			$$[$0-1].queriesidx = yy.queries.length;
			this.$ = $$[$0-1];
		
break;
case 313:
this.$ = $$[$0]
break;
case 314:
 this.$ = new yy.FuncValue({funcid:'CURRENT_TIMESTAMP'});
break;
case 315:
 this.$ = new yy.FuncValue({funcid:'CURRENT_DATE'});
break;
case 316:
 this.$ = new yy.JavaScript({value:$$[$0].substr(2,$$[$0].length-4)}); 
break;
case 317:
 this.$ = new yy.JavaScript({value:'alasql.fn["'+$$[$0-2]+'"] = '+$$[$0].substr(2,$$[$0].length-4)}); 
break;
case 318:
 this.$ = new yy.JavaScript({value:'alasql.aggr["'+$$[$0-2]+'"] = '+$$[$0].substr(2,$$[$0].length-4)}); 
break;
case 319:
 this.$ = new yy.FuncValue({funcid:$$[$0], newid:true}); 
break;
case 320:
 this.$ = $$[$0]; yy.extend(this.$,{newid:true}); 
break;
case 321:
 this.$ = new yy.Convert({expression:$$[$0-3]}) ; yy.extend(this.$,$$[$0-1]) ; 
break;
case 322:
 this.$ = new yy.Convert({expression:$$[$0-5], style:$$[$0-1]}) ; yy.extend(this.$,$$[$0-3]) ; 
break;
case 323:
 this.$ = new yy.Convert({expression:$$[$0-1]}) ; yy.extend(this.$,$$[$0-3]) ; 
break;
case 324:
 this.$ = new yy.Convert({expression:$$[$0-3], style:$$[$0-1]}) ; yy.extend(this.$,$$[$0-5]) ; 
break;
case 331:
 this.$ = new yy.FuncValue({funcid:'CURRENT_TIMESTAMP'}); 
break;
case 332:
 this.$ = new yy.FuncValue({funcid:'CURRENT_DATE'}); 
break;
case 333:

		  if($$[$0-2].length > 1 && ($$[$0-4].toUpperCase() == 'MAX' || $$[$0-4].toUpperCase() == 'MIN')) {
		  	this.$ = new yy.FuncValue({funcid:$$[$0-4],args:$$[$0-2]});
		  } else {
			this.$ = new yy.AggrValue({aggregatorid: $$[$0-4].toUpperCase(), expression: $$[$0-2].pop(), over:$$[$0]});
		  }
		
break;
case 334:
 this.$ = new yy.AggrValue({aggregatorid: $$[$0-5].toUpperCase(), expression: $$[$0-2], distinct:true, over:$$[$0]}); 
break;
case 335:
 this.$ = new yy.AggrValue({aggregatorid: $$[$0-5].toUpperCase(), expression: $$[$0-2],
		 over:$$[$0]}); 
break;
case 337: case 338:
 this.$ = new yy.Over(); yy.extend(this.$,$$[$0-1]); 
break;
case 339:
 this.$ = new yy.Over(); yy.extend(this.$,$$[$0-2]); yy.extend(this.$,$$[$0-1]);
break;
case 340:
 this.$ = {partition:$$[$0]}; 
break;
case 341:
 this.$ = {order:$$[$0]}; 
break;
case 342:
 this.$ = "SUM"; 
break;
case 343:
 this.$ = "TOTAL"; 
break;
case 344:
 this.$ = "COUNT"; 
break;
case 345:
 this.$ = "MIN"; 
break;
case 346: case 553:
 this.$ = "MAX"; 
break;
case 347:
 this.$ = "AVG"; 
break;
case 348:
 this.$ = "FIRST"; 
break;
case 349:
 this.$ = "LAST"; 
break;
case 350:
 this.$ = "AGGR"; 
break;
case 351:
 this.$ = "ARRAY"; 
break;
case 352:

			var funcid = $$[$0-4];
			var exprlist = $$[$0-1];
			if(exprlist.length > 1 && (funcid.toUpperCase() == 'MIN' || funcid.toUpperCase() == 'MAX')) {
					this.$ = new yy.FuncValue({funcid: funcid, args: exprlist});
			} else if(alasql.aggr[$$[$0-4]]) {
		    	this.$ = new yy.AggrValue({aggregatorid: 'REDUCE',
                      funcid: funcid, expression: exprlist.pop(),distinct:($$[$0-2]=='DISTINCT') });
		    } else {
			    this.$ = new yy.FuncValue({funcid: funcid, args: exprlist});
			};
		
break;
case 353: case 356:
 this.$ = new yy.FuncValue({ funcid: $$[$0-2] }) 
break;
case 354:
 this.$ = new yy.FuncValue({ funcid: 'IIF', args:$$[$0-1] }) 
break;
case 355:
 this.$ = new yy.FuncValue({ funcid: 'REPLACE', args:$$[$0-1] }) 
break;
case 357:
 this.$ = new yy.FuncValue({ funcid: 'DATEADD', args:[new yy.StringValue({value:$$[$0-5]}),$$[$0-3],$$[$0-1]]}) 
break;
case 358:
 this.$ = new yy.FuncValue({ funcid: 'DATEADD', args:[$$[$0-5],$$[$0-3],$$[$0-1]]}) 
break;
case 359:
 this.$ = new yy.FuncValue({ funcid: 'DATEDIFF', args:[new yy.StringValue({value:$$[$0-5]}),$$[$0-3],$$[$0-1]]}) 
break;
case 360:
 this.$ = new yy.FuncValue({ funcid: 'DATEDIFF', args:[$$[$0-5],$$[$0-3],$$[$0-1]]}) 
break;
case 361:
 this.$ = new yy.FuncValue({ funcid: 'TIMESTAMPDIFF', args:[new yy.StringValue({value:$$[$0-5]}),$$[$0-3],$$[$0-1]]}) 
break;
case 362:
 this.$ = new yy.FuncValue({ funcid: 'INTERVAL', args:[$$[$0-1],new yy.StringValue({value:($$[$0]).toLowerCase()})]}); 
break;
case 364:
 $$[$0-2].push($$[$0]); this.$ = $$[$0-2] 
break;
case 365:
 this.$ = new yy.NumValue({value:+$$[$0]}); 
break;
case 366:
 this.$ = new yy.LogicValue({value:true}); 
break;
case 367:
 this.$ = new yy.LogicValue({value:false}); 
break;
case 368:
 this.$ = new yy.StringValue({value: $$[$0].substr(1,$$[$0].length-2).replace(/(\\\')/g,"'").replace(/(\'\')/g,"'")}); 
break;
case 369:
 this.$ = new yy.StringValue({value: $$[$0].substr(2,$$[$0].length-3).replace(/(\\\')/g,"'").replace(/(\'\')/g,"'")}); 
break;
case 370:
 this.$ = new yy.NullValue({value:undefined}); 
break;
case 371:
 this.$ = new yy.VarValue({variable:$$[$0]}); 
break;
case 372:

			if(!yy.exists) yy.exists = [];
			this.$ = new yy.ExistsValue({value:$$[$0-1], existsidx:yy.exists.length});
			yy.exists.push($$[$0-1]);
		
break;
case 373:
 this.$ = new yy.ArrayValue({value:$$[$0-1]}); 
break;
case 374: case 375:
 this.$ = new yy.ParamValue({param: $$[$0]}); 
break;
case 376:

			if(typeof yy.question == 'undefined') yy.question = 0;
			this.$ = new yy.ParamValue({param: yy.question++});
		
break;
case 377:

			if(typeof yy.question == 'undefined') yy.question = 0;
			this.$ = new yy.ParamValue({param: yy.question++, array:true});
		
break;
case 378:
 this.$ = new yy.CaseValue({expression:$$[$0-3], whens: $$[$0-2], elses: $$[$0-1]}); 
break;
case 379:
 this.$ = new yy.CaseValue({whens: $$[$0-2], elses: $$[$0-1]}); 
break;
case 380: case 709: case 710:
 this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 382:
 this.$ = {when: $$[$0-2], then: $$[$0] }; 
break;
case 385: case 386:
 this.$ = new yy.Op({left:$$[$0-2], op:'REGEXP', right:$$[$0]}); 
break;
case 387:
 this.$ = new yy.Op({left:$$[$0-2], op:'GLOB', right:$$[$0]}); 
break;
case 388:
 this.$ = new yy.Op({left:$$[$0-2], op:'LIKE', right:$$[$0]}); 
break;
case 389:
 this.$ = new yy.Op({left:$$[$0-4], op:'LIKE', right:$$[$0-2], escape:$$[$0]}); 
break;
case 390:
 this.$ = new yy.Op({left:$$[$0-2], op:'NOT LIKE', right:$$[$0] }); 
break;
case 391:
 this.$ = new yy.Op({left:$$[$0-4], op:'NOT LIKE', right:$$[$0-2], escape:$$[$0] }); 
break;
case 392:
 this.$ = new yy.Op({left:$$[$0-2], op:'||', right:$$[$0]}); 
break;
case 393:
 this.$ = new yy.Op({left:$$[$0-2], op:'+', right:$$[$0]}); 
break;
case 394:
 this.$ = new yy.Op({left:$$[$0-2], op:'-', right:$$[$0]}); 
break;
case 395:
 this.$ = new yy.Op({left:$$[$0-2], op:'*', right:$$[$0]}); 
break;
case 396:
 this.$ = new yy.Op({left:$$[$0-2], op:'/', right:$$[$0]}); 
break;
case 397:
 this.$ = new yy.Op({left:$$[$0-2], op:'%', right:$$[$0]}); 
break;
case 398:
 this.$ = new yy.Op({left:$$[$0-2], op:'^', right:$$[$0]}); 
break;
case 399:
 this.$ = new yy.Op({left:$$[$0-2], op:'>>', right:$$[$0]}); 
break;
case 400:
 this.$ = new yy.Op({left:$$[$0-2], op:'<<', right:$$[$0]}); 
break;
case 401:
 this.$ = new yy.Op({left:$$[$0-2], op:'&', right:$$[$0]}); 
break;
case 402:
 this.$ = new yy.Op({left:$$[$0-2], op:'|', right:$$[$0]}); 
break;
case 403: case 404: case 406:
 this.$ = new yy.Op({left:$$[$0-2], op:'->' , right:$$[$0]}); 
break;
case 405:
 this.$ = new yy.Op({left:$$[$0-4], op:'->' , right:$$[$0-1]}); 
break;
case 407: case 408: case 410:
 this.$ = new yy.Op({left:$$[$0-2], op:'!' , right:$$[$0]}); 
break;
case 409:
 this.$ = new yy.Op({left:$$[$0-4], op:'!' , right:$$[$0-1]}); 
break;
case 411:
 this.$ = new yy.Op({left:$$[$0-2], op:'>' , right:$$[$0]}); 
break;
case 412:
 this.$ = new yy.Op({left:$$[$0-2], op:'>=' , right:$$[$0]}); 
break;
case 413:
 this.$ = new yy.Op({left:$$[$0-2], op:'<' , right:$$[$0]}); 
break;
case 414:
 this.$ = new yy.Op({left:$$[$0-2], op:'<=' , right:$$[$0]}); 
break;
case 415:
 this.$ = new yy.Op({left:$$[$0-2], op:'=' , right:$$[$0]}); 
break;
case 416:
 this.$ = new yy.Op({left:$$[$0-2], op:'==' , right:$$[$0]}); 
break;
case 417:
 this.$ = new yy.Op({left:$$[$0-2], op:'===' , right:$$[$0]}); 
break;
case 418:
 this.$ = new yy.Op({left:$$[$0-2], op:'!=' , right:$$[$0]}); 
break;
case 419:
 this.$ = new yy.Op({left:$$[$0-2], op:'!==' , right:$$[$0]}); 
break;
case 420:
 this.$ = new yy.Op({left:$$[$0-2], op:'!===' , right:$$[$0]}); 
break;
case 421:

			if(!yy.queries) yy.queries = [];
			this.$ = new yy.Op({left:$$[$0-5], op:$$[$0-4] , allsome:$$[$0-3], right:$$[$0-1], queriesidx: yy.queries.length});
			yy.queries.push($$[$0-1]);
		
break;
case 422:

			this.$ = new yy.Op({left:$$[$0-5], op:$$[$0-4] , allsome:$$[$0-3], right:$$[$0-1]});
		
break;
case 423:

			if($$[$0-2].op == 'BETWEEN1') {

				if($$[$0-2].left.op == 'AND') {
					this.$ = new yy.Op({left:$$[$0-2].left.left,op:'AND',right:
						new yy.Op({left:$$[$0-2].left.right, op:'BETWEEN',
							right1:$$[$0-2].right, right2:$$[$0]})
					});
				} else {
					this.$ = new yy.Op({left:$$[$0-2].left, op:'BETWEEN',
						right1:$$[$0-2].right, right2:$$[$0]});
				}

			} else if($$[$0-2].op == 'NOT BETWEEN1') {
				if($$[$0-2].left.op == 'AND') {
					this.$ = new yy.Op({left:$$[$0-2].left.left,op:'AND',right:
						new yy.Op({left:$$[$0-2].left.right, op:'NOT BETWEEN',
							right1:$$[$0-2].right, right2:$$[$0]})
					});
				} else {
					this.$ = new yy.Op({left:$$[$0-2].left, op:'NOT BETWEEN',
						right1:$$[$0-2].right, right2:$$[$0]});
				}
			} else {
				this.$ = new yy.Op({left:$$[$0-2], op:'AND', right:$$[$0]});
			}


		
break;
case 424:
 this.$ = new yy.Op({left:$$[$0-2], op:'OR' , right:$$[$0]}); 
break;
case 425:
 this.$ = new yy.UniOp({op:'NOT' , right:$$[$0]}); 
break;
case 426:
 this.$ = new yy.UniOp({op:'-' , right:$$[$0]}); 
break;
case 427:
 this.$ = new yy.UniOp({op:'+' , right:$$[$0]}); 
break;
case 428:
 this.$ = new yy.UniOp({op:'~' , right:$$[$0]}); 
break;
case 429:
 this.$ = new yy.UniOp({op:'#' , right:$$[$0]}); 
break;
case 430:
 this.$ = new yy.UniOp({right: $$[$0-1]}); 
break;
case 431:

			if(!yy.queries) yy.queries = [];
			this.$ = new yy.Op({left: $$[$0-4], op:'IN', right:$$[$0-1], queriesidx: yy.queries.length});
			yy.queries.push($$[$0-1]);
		
break;
case 432:

			if(!yy.queries) yy.queries = [];
			this.$ = new yy.Op({left: $$[$0-5], op:'NOT IN', right:$$[$0-1], queriesidx: yy.queries.length});
			yy.queries.push($$[$0-1]);
		
break;
case 433:
 this.$ = new yy.Op({left: $$[$0-4], op:'IN', right:$$[$0-1]}); 
break;
case 434:
 this.$ = new yy.Op({left: $$[$0-5], op:'NOT IN', right:$$[$0-1]}); 
break;
case 435:
 this.$ = new yy.Op({left: $$[$0-3], op:'IN', right:[]}); 
break;
case 436:
 this.$ = new yy.Op({left: $$[$0-4], op:'NOT IN', right:[]}); 
break;
case 437: case 439:
 this.$ = new yy.Op({left: $$[$0-2], op:'IN', right:$$[$0]}); 
break;
case 438: case 440:
 this.$ = new yy.Op({left: $$[$0-3], op:'NOT IN', right:$$[$0]}); 
break;
case 441:

/*			var expr = $$[$0];
			if(expr.left && expr.left.op == 'AND') {
				this.$ = new yy.Op({left:new yy.Op({left:$$[$0-2], op:'BETWEEN', right:expr.left}), op:'AND', right:expr.right });
			} else {
*/
				this.$ = new yy.Op({left:$$[$0-2], op:'BETWEEN1', right:$$[$0] });
//			}
		
break;
case 442:

//			var expr = $$[$0];
//			if(expr.left && expr.left.op == 'AND') {
//				this.$ = new yy.Op({left:new yy.Op({left:$$[$0-2], op:'NOT BETWEEN', right:expr.left}), op:'AND', right:expr.right });
//			} else {
				this.$ = new yy.Op({left:$$[$0-2], op:'NOT BETWEEN1', right:$$[$0] });
//			}
		
break;
case 443:
 this.$ = new yy.Op({op:'IS' , left:$$[$0-2], right:$$[$0]}); 
break;
case 444:

			this.$ = new yy.Op({
				op:'IS',
				left:$$[$0-2],
				right: new yy.UniOp({
					op:'NOT',
					right:new yy.NullValue({value:undefined})
				})
			});
		
break;
case 445:
 this.$ = new yy.Convert({expression:$$[$0-2]}) ; yy.extend(this.$,$$[$0]) ; 
break;
case 446: case 447:
 this.$ = $$[$0];
break;
case 448:
 this.$ = $$[$0-1];
break;
case 455:
 this.$ = 'ALL'; 
break;
case 456:
 this.$ = 'SOME'; 
break;
case 457:
 this.$ = 'ANY'; 
break;
case 458:
 this.$ = new yy.Update({table:$$[$0-4], columns:$$[$0-2], where:$$[$0]}); 
break;
case 459:
 this.$ = new yy.Update({table:$$[$0-2], columns:$$[$0]}); 
break;
case 462:
 this.$ = new yy.SetColumn({column:$$[$0-2], expression:$$[$0]})
break;
case 463:
 this.$ = new yy.SetColumn({variable:$$[$0-2], expression:$$[$0], method:$$[$0-3]})
break;
case 464:
 this.$ = new yy.Delete({table:$$[$0-2], where:$$[$0]});
break;
case 465:
 this.$ = new yy.Delete({table:$$[$0]});
break;
case 466:
 this.$ = new yy.Insert({into:$$[$0-2], values: $$[$0]}); 
break;
case 467:
 this.$ = new yy.Insert({into:$$[$0-1], values: $$[$0]}); 
break;
case 468: case 470:
 this.$ = new yy.Insert({into:$$[$0-2], values: $$[$0], orreplace:true}); 
break;
case 469: case 471:
 this.$ = new yy.Insert({into:$$[$0-1], values: $$[$0], orreplace:true}); 
break;
case 472:
 this.$ = new yy.Insert({into:$$[$0-2], "default": true}) ; 
break;
case 473:
 this.$ = new yy.Insert({into:$$[$0-5], columns: $$[$0-3], values: $$[$0]}); 
break;
case 474:
 this.$ = new yy.Insert({into:$$[$0-4], columns: $$[$0-2], values: $$[$0]}); 
break;
case 475:
 this.$ = new yy.Insert({into:$$[$0-1], select: $$[$0]}); 
break;
case 476:
 this.$ = new yy.Insert({into:$$[$0-1], select: $$[$0], orreplace:true}); 
break;
case 477:
 this.$ = new yy.Insert({into:$$[$0-4], columns: $$[$0-2], select: $$[$0]}); 
break;
case 482:
 this.$ = [$$[$0-1]]; 
break;
case 485:
this.$ = $$[$0-4]; $$[$0-4].push($$[$0-1])
break;
case 486: case 487: case 489: case 497:
this.$ = $$[$0-2]; $$[$0-2].push($$[$0])
break;
case 498:

			this.$ = new yy.CreateTable({table:$$[$0-4]});
			yy.extend(this.$,$$[$0-7]);
			yy.extend(this.$,$$[$0-6]);
			yy.extend(this.$,$$[$0-5]);
			yy.extend(this.$,$$[$0-2]);
			yy.extend(this.$,$$[$0]);
		
break;
case 499:

			this.$ = new yy.CreateTable({table:$$[$0]});
			yy.extend(this.$,$$[$0-3]);
			yy.extend(this.$,$$[$0-2]);
			yy.extend(this.$,$$[$0-1]);
		
break;
case 501:
 this.$ = {class:true}; 
break;
case 511:
 this.$ = {temporary:true}; 
break;
case 513:
 this.$ = {ifnotexists: true}; 
break;
case 514:
 this.$ = {columns: $$[$0-2], constraints: $$[$0]}; 
break;
case 515:
 this.$ = {columns: $$[$0]}; 
break;
case 516:
 this.$ = {as: $$[$0]} 
break;
case 517: case 541:
 this.$ = [$$[$0]];
break;
case 519: case 520: case 521: case 522: case 523:
 $$[$0].constraintid = $$[$0-1]; this.$ = $$[$0]; 
break;
case 526:
 this.$ = {type: 'CHECK', expression: $$[$0-1]}; 
break;
case 527:
 this.$ = {type: 'PRIMARY KEY', columns: $$[$0-1], clustered:($$[$0-3]+'').toUpperCase()}; 
break;
case 528:
 this.$ = {type: 'FOREIGN KEY', columns: $$[$0-5], fktable: $$[$0-2], fkcolumns: $$[$0-1]}; 
break;
case 534:

			this.$ = {type: 'UNIQUE', columns: $$[$0-1], clustered:($$[$0-3]+'').toUpperCase()};
		
break;
case 543:
 this.$ = new yy.ColumnDef({columnid:$$[$0-2]}); yy.extend(this.$,$$[$0-1]); yy.extend(this.$,$$[$0]);
break;
case 544:
 this.$ = new yy.ColumnDef({columnid:$$[$0-1]}); yy.extend(this.$,$$[$0]); 
break;
case 545:
 this.$ = new yy.ColumnDef({columnid:$$[$0], dbtypeid: ''}); 
break;
case 546:
 this.$ = {dbtypeid: $$[$0-5], dbsize: $$[$0-3], dbprecision: +$$[$0-1]} 
break;
case 547:
 this.$ = {dbtypeid: $$[$0-3], dbsize: $$[$0-1]} 
break;
case 548:
 this.$ = {dbtypeid: $$[$0]} 
break;
case 549:
 this.$ = {dbtypeid: 'ENUM', enumvalues: $$[$0-1]} 
break;
case 550:
 this.$ = $$[$0-1]; $$[$0-1].dbtypeid += '[' + $$[$0] + ']'; 
break;
case 552: case 760:
 this.$ = +$$[$0]; 
break;
case 554:
this.$ = undefined
break;
case 556:

			yy.extend($$[$0-1],$$[$0]); this.$ = $$[$0-1];
		
break;
case 559:
this.$ = {primarykey:true};
break;
case 560: case 561:
this.$ = {foreignkey:{table:$$[$0-1], columnid: $$[$0]}};
break;
case 562:
 this.$ = {identity: {value:$$[$0-3],step:$$[$0-1]}} 
break;
case 563:
 this.$ = {identity: {value:1,step:1}} 
break;
case 564: case 566:
this.$ = {"default":$$[$0]};
break;
case 565:
this.$ = {"default":$$[$0-1]};
break;
case 567:
this.$ = {null:true}; 
break;
case 568:
this.$ = {notnull:true}; 
break;
case 569:
this.$ = {check:$$[$0]}; 
break;
case 570:
this.$ = {unique:true}; 
break;
case 571:
this.$ = {"onupdate":$$[$0]};
break;
case 572:
this.$ = {"onupdate":$$[$0-1]};
break;
case 573:
 this.$ = new yy.DropTable({tables:$$[$0],type:$$[$0-2]}); yy.extend(this.$, $$[$0-1]); 
break;
case 577:
 this.$ = {ifexists: true};
break;
case 578:
 this.$ = new yy.AlterTable({table:$$[$0-3], renameto: $$[$0]});
break;
case 579:
 this.$ = new yy.AlterTable({table:$$[$0-3], addcolumn: $$[$0]});
break;
case 580:
 this.$ = new yy.AlterTable({table:$$[$0-3], modifycolumn: $$[$0]});
break;
case 581:
 this.$ = new yy.AlterTable({table:$$[$0-5], renamecolumn: $$[$0-2], to: $$[$0]});
break;
case 582:
 this.$ = new yy.AlterTable({table:$$[$0-3], dropcolumn: $$[$0]});
break;
case 583:
 this.$ = new yy.AlterTable({table:$$[$0-2], renameto: $$[$0]});
break;
case 584:
 this.$ = new yy.AttachDatabase({databaseid:$$[$0], engineid:$$[$0-2].toUpperCase() });
break;
case 585:
 this.$ = new yy.AttachDatabase({databaseid:$$[$0-3], engineid:$$[$0-5].toUpperCase(), args:$$[$0-1] });
break;
case 586:
 this.$ = new yy.AttachDatabase({databaseid:$$[$0-2], engineid:$$[$0-4].toUpperCase(), as:$$[$0] });
break;
case 587:
 this.$ = new yy.AttachDatabase({databaseid:$$[$0-5], engineid:$$[$0-7].toUpperCase(), as:$$[$0], args:$$[$0-3]});
break;
case 588:
 this.$ = new yy.DetachDatabase({databaseid:$$[$0]});
break;
case 589:
 this.$ = new yy.CreateDatabase({databaseid:$$[$0] }); yy.extend(this.$,$$[$0]); 
break;
case 590:
 this.$ = new yy.CreateDatabase({engineid:$$[$0-4].toUpperCase(), databaseid:$$[$0-1], as:$$[$0] }); yy.extend(this.$,$$[$0-2]); 
break;
case 591:
 this.$ = new yy.CreateDatabase({engineid:$$[$0-7].toUpperCase(), databaseid:$$[$0-4], args:$$[$0-2], as:$$[$0] }); yy.extend(this.$,$$[$0-5]); 
break;
case 592:
 this.$ = new yy.CreateDatabase({engineid:$$[$0-4].toUpperCase(),
		    as:$$[$0], args:[$$[$0-1]] }); yy.extend(this.$,$$[$0-2]); 
break;
case 593:
this.$ = undefined;
break;
case 595: case 596:
 this.$ = new yy.UseDatabase({databaseid: $$[$0] });
break;
case 597:
 this.$ = new yy.DropDatabase({databaseid: $$[$0] }); yy.extend(this.$,$$[$0-1]); 
break;
case 598: case 599:
 this.$ = new yy.DropDatabase({databaseid: $$[$0], engineid:$$[$0-3].toUpperCase() }); yy.extend(this.$,$$[$0-1]); 
break;
case 600:
 this.$ = new yy.CreateIndex({indexid:$$[$0-5], table:$$[$0-3], columns:$$[$0-1]})
break;
case 601:
 this.$ = new yy.CreateIndex({indexid:$$[$0-5], table:$$[$0-3], columns:$$[$0-1], unique:true})
break;
case 602:
 this.$ = new yy.DropIndex({indexid:$$[$0]});
break;
case 603:
 this.$ = new yy.ShowDatabases();
break;
case 604:
 this.$ = new yy.ShowDatabases({like:$$[$0]});
break;
case 605:
 this.$ = new yy.ShowDatabases({engineid:$$[$0-1].toUpperCase() });
break;
case 606:
 this.$ = new yy.ShowDatabases({engineid:$$[$0-3].toUpperCase() , like:$$[$0]});
break;
case 607:
 this.$ = new yy.ShowTables();
break;
case 608:
 this.$ = new yy.ShowTables({like:$$[$0]});
break;
case 609:
 this.$ = new yy.ShowTables({databaseid: $$[$0]});
break;
case 610:
 this.$ = new yy.ShowTables({like:$$[$0], databaseid: $$[$0-2]});
break;
case 611:
 this.$ = new yy.ShowColumns({table: $$[$0]});
break;
case 612:
 this.$ = new yy.ShowColumns({table: $$[$0-2], databaseid:$$[$0]});
break;
case 613:
 this.$ = new yy.ShowIndex({table: $$[$0]});
break;
case 614:
 this.$ = new yy.ShowIndex({table: $$[$0-2], databaseid: $$[$0]});
break;
case 615:
 this.$ = new yy.ShowCreateTable({table: $$[$0]});
break;
case 616:
 this.$ = new yy.ShowCreateTable({table: $$[$0-2], databaseid:$$[$0]});
break;
case 617:

			this.$ = new yy.CreateTable({table:$$[$0-6],view:true,select:$$[$0-1],viewcolumns:$$[$0-4]});
			yy.extend(this.$,$$[$0-9]);
			yy.extend(this.$,$$[$0-7]);
		
break;
case 618:

			this.$ = new yy.CreateTable({table:$$[$0-3],view:true,select:$$[$0-1]});
			yy.extend(this.$,$$[$0-6]);
			yy.extend(this.$,$$[$0-4]);
		
break;
case 622:
 this.$ = new yy.DropTable({tables:$$[$0], view:true}); yy.extend(this.$, $$[$0-1]); 
break;
case 623: case 770:
 this.$ = new yy.ExpressionStatement({expression:$$[$0]}); 
break;
case 624:
 this.$ = new yy.Source({url:$$[$0].value}); 
break;
case 625:
 this.$ = new yy.Assert({value:$$[$0]}); 
break;
case 626:
 this.$ = new yy.Assert({value:$$[$0].value}); 
break;
case 627:
 this.$ = new yy.Assert({value:$$[$0], message:$$[$0-2]}); 
break;
case 629: case 640: case 642:
 this.$ = $$[$0].value; 
break;
case 630: case 638:
 this.$ = +$$[$0].value; 
break;
case 631:
 this.$ = (!!$$[$0].value); 
break;
case 639:
 this.$ = ""+$$[$0].value; 
break;
case 648:
 this.$ = {}; 
break;
case 651:
 this.$ = []; 
break;
case 652:
 yy.extend($$[$0-2],$$[$0]); this.$ = $$[$0-2]; 
break;
case 654:
 this.$ = {}; this.$[$$[$0-2].substr(1,$$[$0-2].length-2)] = $$[$0]; 
break;
case 655: case 656:
 this.$ = {}; this.$[$$[$0-2]] = $$[$0]; 
break;
case 659:
 this.$ = new yy.SetVariable({variable:$$[$0-2].toLowerCase(), value:$$[$0]});
break;
case 660:
 this.$ = new yy.SetVariable({variable:$$[$0-1].toLowerCase(), value:$$[$0]});
break;
case 661:
 this.$ = new yy.SetVariable({variable:$$[$0-2], expression:$$[$0]});
break;
case 662:
 this.$ = new yy.SetVariable({variable:$$[$0-3], props: $$[$0-2], expression:$$[$0]});
break;
case 663:
 this.$ = new yy.SetVariable({variable:$$[$0-2], expression:$$[$0], method:$$[$0-3]});
break;
case 664:
 this.$ = new yy.SetVariable({variable:$$[$0-3], props: $$[$0-2], expression:$$[$0], method:$$[$0-4]});
break;
case 665:
this.$ = '@'; 
break;
case 666:
this.$ = '$'; 
break;
case 672:
 this.$ = true; 
break;
case 673:
 this.$ = false; 
break;
case 674:
 this.$ = new yy.CommitTransaction(); 
break;
case 675:
 this.$ = new yy.RollbackTransaction(); 
break;
case 676:
 this.$ = new yy.BeginTransaction(); 
break;
case 677:
 this.$ = new yy.If({expression:$$[$0-2],thenstat:$$[$0-1], elsestat:$$[$0]});
			if($$[$0-1].exists) this.$.exists = $$[$0-1].exists;
			if($$[$0-1].queries) this.$.queries = $$[$0-1].queries;
		
break;
case 678:

			this.$ = new yy.If({expression:$$[$0-1],thenstat:$$[$0]});
			if($$[$0].exists) this.$.exists = $$[$0].exists;
			if($$[$0].queries) this.$.queries = $$[$0].queries;
		
break;
case 679:
this.$ = $$[$0];
break;
case 680:
 this.$ = new yy.While({expression:$$[$0-1],loopstat:$$[$0]});
			if($$[$0].exists) this.$.exists = $$[$0].exists;
			if($$[$0].queries) this.$.queries = $$[$0].queries;
		
break;
case 681:
 this.$ = new yy.Continue(); 
break;
case 682:
 this.$ = new yy.Break(); 
break;
case 683:
 this.$ = new yy.BeginEnd({statements:$$[$0-1]}); 
break;
case 684:
 this.$ = new yy.Print({exprs:$$[$0]});
break;
case 685:
 this.$ = new yy.Print({select:$$[$0]});
break;
case 686:
 this.$ = new yy.Require({paths:$$[$0]}); 
break;
case 687:
 this.$ = new yy.Require({plugins:$$[$0]}); 
break;
case 688: case 689:
this.$ = $$[$0].toUpperCase(); 
break;
case 690:
 this.$ = new yy.Echo({expr:$$[$0]}); 
break;
case 695:
 this.$ = new yy.Declare({declares:$$[$0]}); 
break;
case 698:
 this.$ = {variable: $$[$0-1]}; yy.extend(this.$,$$[$0]); 
break;
case 699:
 this.$ = {variable: $$[$0-2]}; yy.extend(this.$,$$[$0]); 
break;
case 700:
 this.$ = {variable: $$[$0-3], expression:$$[$0]}; yy.extend(this.$,$$[$0-2]);
break;
case 701:
 this.$ = {variable: $$[$0-4], expression:$$[$0]}; yy.extend(this.$,$$[$0-2]);
break;
case 702:
 this.$ = new yy.TruncateTable({table:$$[$0]});
break;
case 703:

			this.$ = new yy.Merge(); yy.extend(this.$,$$[$0-4]); yy.extend(this.$,$$[$0-3]);
			yy.extend(this.$,$$[$0-2]);
			yy.extend(this.$,{matches:$$[$0-1]});yy.extend(this.$,$$[$0]);
		
break;
case 704: case 705:
 this.$ = {into: $$[$0]}; 
break;
case 708:
 this.$ = {on:$$[$0]}; 
break;
case 713:
 this.$ = {matched:true, action:$$[$0]} 
break;
case 714:
 this.$ = {matched:true, expr: $$[$0-2], action:$$[$0]} 
break;
case 715:
 this.$ = {delete:true}; 
break;
case 716:
 this.$ = {update:$$[$0]}; 
break;
case 717: case 718:
 this.$ = {matched:false, bytarget: true, action:$$[$0]} 
break;
case 719: case 720:
 this.$ = {matched:false, bytarget: true, expr:$$[$0-2], action:$$[$0]} 
break;
case 721:
 this.$ = {matched:false, bysource: true, action:$$[$0]} 
break;
case 722:
 this.$ = {matched:false, bysource: true, expr:$$[$0-2], action:$$[$0]} 
break;
case 723:
 this.$ = {insert:true, values:$$[$0]}; 
break;
case 724:
 this.$ = {insert:true, values:$$[$0], columns:$$[$0-3]}; 
break;
case 725:
 this.$ = {insert:true, defaultvalues:true}; 
break;
case 726:
 this.$ = {insert:true, defaultvalues:true, columns:$$[$0-3]}; 
break;
case 728:
 this.$ = {output:{columns:$$[$0]}} 
break;
case 729:
 this.$ = {output:{columns:$$[$0-3], intovar: $$[$0], method:$$[$0-1]}} 
break;
case 730:
 this.$ = {output:{columns:$$[$0-2], intotable: $$[$0]}} 
break;
case 731:
 this.$ = {output:{columns:$$[$0-5], intotable: $$[$0-3], intocolumns:$$[$0-1]}} 
break;
case 732:

			this.$ = new yy.CreateVertex({class:$$[$0-3],sharp:$$[$0-2], name:$$[$0-1]});
			yy.extend(this.$,$$[$0]);
		
break;
case 735:
 this.$ = {sets:$$[$0]}; 
break;
case 736:
 this.$ = {content:$$[$0]}; 
break;
case 737:
 this.$ = {select:$$[$0]}; 
break;
case 738:

			this.$ = new yy.CreateEdge({from:$$[$0-3],to:$$[$0-1],name:$$[$0-5]});
			yy.extend(this.$,$$[$0]);
		
break;
case 739:
 this.$ = new yy.CreateGraph({graph:$$[$0]}); 
break;
case 740:
 this.$ = new yy.CreateGraph({from:$$[$0]}); 
break;
case 743:

			this.$ = $$[$0-2];
			if($$[$0-1]) this.$.json = new yy.Json({value:$$[$0-1]});
			if($$[$0]) this.$.as = $$[$0];
		
break;
case 744:

			this.$ = {source:$$[$0-6], target: $$[$0]};
			if($$[$0-3]) this.$.json = new yy.Json({value:$$[$0-3]});
			if($$[$0-2]) this.$.as = $$[$0-2];
			yy.extend(this.$,$$[$0-4]);
		
break;
case 745:

			this.$ = {source:$$[$0-5], target: $$[$0]};
			if($$[$0-2]) this.$.json = new yy.Json({value:$$[$0-3]});
			if($$[$0-1]) this.$.as = $$[$0-2];
		
break;
case 746:

			this.$ = {source:$$[$0-2], target: $$[$0]};
		
break;
case 750:
 this.$ = {vars:$$[$0], method:$$[$0-1]}; 
break;
case 753: case 754:

			var s3 = $$[$0-1];
			this.$ = {prop:$$[$0-3], sharp:$$[$0-2], name:(typeof s3 == 'undefined')?undefined:s3.substr(1,s3.length-2), class:$$[$0]};
		
break;
case 755:

			var s2 = $$[$0-1];
			this.$ = {sharp:$$[$0-2], name:(typeof s2 == 'undefined')?undefined:s2.substr(1,s2.length-2), class:$$[$0]};
		
break;
case 756:

			var s1 = $$[$0-1];
			this.$ = {name:(typeof s1 == 'undefined')?undefined:s1.substr(1,s1.length-2), class:$$[$0]};
		
break;
case 757:

			this.$ = {class:$$[$0]};
		
break;
case 763:
 this.$ = new yy.AddRule({left:$$[$0-2], right:$$[$0]}); 
break;
case 764:
 this.$ = new yy.AddRule({right:$$[$0]}); 
break;
case 767:
 this.$ = {termid: $$[$0]}; 
break;
case 768:
 this.$ = {termid:$$[$0-3], args:$$[$0-1]}; 
break;
case 771:

			this.$ = new yy.CreateTrigger({trigger:$$[$0-6], when:$$[$0-5], action:$$[$0-4], table:$$[$0-2], statement:$$[$0]});
			if($$[$0].exists) this.$.exists = $$[$0].exists;
			if($$[$0].queries) this.$.queries = $$[$0].queries;
		
break;
case 772:

			this.$ = new yy.CreateTrigger({trigger:$$[$0-5], when:$$[$0-4], action:$$[$0-3], table:$$[$0-1], funcid:$$[$0]});
		
break;
case 773:

			this.$ = new yy.CreateTrigger({trigger:$$[$0-6], when:$$[$0-4], action:$$[$0-3], table:$$[$0-5], statement:$$[$0]});
			if($$[$0].exists) this.$.exists = $$[$0].exists;
			if($$[$0].queries) this.$.queries = $$[$0].queries;
		
break;
case 774: case 775: case 777:
 this.$ = 'AFTER'; 
break;
case 776:
 this.$ = 'BEFORE'; 
break;
case 778:
 this.$ = 'INSTEADOF'; 
break;
case 779:
 this.$ = 'INSERT'; 
break;
case 780:
 this.$ = 'DELETE'; 
break;
case 781:
 this.$ = 'UPDATE'; 
break;
case 782:
 this.$ = new yy.DropTrigger({trigger:$$[$0]}); 
break;
case 783:
 this.$ = new yy.Reindex({indexid:$$[$0]});
break;
case 1057: case 1077: case 1079: case 1081: case 1085: case 1087: case 1089: case 1091: case 1093: case 1095:
this.$ = [];
break;
case 1058: case 1072: case 1074: case 1078: case 1080: case 1082: case 1086: case 1088: case 1090: case 1092: case 1094: case 1096:
$$[$0-1].push($$[$0]);
break;
case 1071: case 1073:
this.$ = [$$[$0]];
break;
}
},

};
