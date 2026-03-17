function __method_wrapper__() {
alasql.prompt = function (el, useidel, firstsql) {
	if (utils.isNode) {
		throw new Error('The prompt not realized for Node.js');
	}

	var prompti = 0;

	if (typeof el === 'string') {
		el = document.getElementById(el);
	}

	if (typeof useidel === 'string') {
		useidel = document.getElementById(useidel);
	}

	useidel.textContent = alasql.useid;

	if (firstsql) {
		alasql.prompthistory.push(firstsql);
		prompti = alasql.prompthistory.length;
		try {
			var tm = Date.now();
			alasql.log(firstsql);
			alasql.write('<p style="color:blue">' + (Date.now() - tm) + ' ms</p>');
		} catch (err) {
			alasql.write('<p>' + alasql.useid + '&gt;&nbsp;<b>' + firstsql + '</b></p>');
			alasql.write('<p style="color:red">' + err + '<p>');
		}
	}

	var y = el.getBoundingClientRect().top + document.getElementsByTagName('body')[0].scrollTop;
	scrollTo(document.getElementsByTagName('body')[0], y, 500);

	el.onkeydown = function (event) {
		if (event.which === 13) {
			var sql = el.value;
			var olduseid = alasql.useid;
			el.value = '';
			alasql.prompthistory.push(sql);
			prompti = alasql.prompthistory.length;
			try {
				var tm = Date.now();
				alasql.log(sql);
				alasql.write('<p style="color:blue">' + (Date.now() - tm) + ' ms</p>');
			} catch (err) {
				alasql.write('<p>' + olduseid + '&gt;&nbsp;' + alasql.pretty(sql, false) + '</p>');
				alasql.write('<p style="color:red">' + err + '<p>');
			}
			el.focus();
			//			console.log(el.getBoundingClientRect().top);
			useidel.textContent = alasql.useid;
			var y = el.getBoundingClientRect().top + document.getElementsByTagName('body')[0].scrollTop;
			scrollTo(document.getElementsByTagName('body')[0], y, 500);
		} else if (event.which === 38) {
			prompti--;
			if (prompti < 0) {
				prompti = 0;
			}
			if (alasql.prompthistory[prompti]) {
				el.value = alasql.prompthistory[prompti];
				event.preventDefault();
			}
		} else if (event.which === 40) {
			prompti++;
			if (prompti >= alasql.prompthistory.length) {
				prompti = alasql.prompthistory.length;
				el.value = '';
			} else if (alasql.prompthistory[prompti]) {
				el.value = alasql.prompthistory[prompti];
				event.preventDefault();
			}
		}
	};
};

}
