const __obj__ = {
	poll_status: function(nodes, data) {
		const element = document.getElementById('tinyproxystatusid');
		if (element) {
			element.innerHTML = '';
			let tempDiv = document.createElement('div');
			if ((data == null) || (data == '')) {
				if (isenabled == 1) {
					tempDiv.innerHTML = _('Waiting for data from url:') + ' ' + url.format(port);
				} else {
					tempDiv.innerHTML = _('Tinyproxy is disabled');
				}
			} else {
				tempDiv.innerHTML = data;
			}
			let styles = tempDiv.querySelectorAll('style');
			styles.forEach(style => style.remove());
			let elements = tempDiv.querySelectorAll('*');
			elements.forEach(el => el.removeAttribute('style'));
			element.appendChild(tempDiv);
		}
	},

};
