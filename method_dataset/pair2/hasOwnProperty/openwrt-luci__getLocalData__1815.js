function __method_wrapper__() {
		getLocalData(key) {
			try {
				const sid = this.getID();
				const item = 'luci-session-store';
				let data = JSON.parse(window.sessionStorage.getItem(item));

				if (!LuCI.prototype.isObject(data) || !data.hasOwnProperty(sid)) {
					data = {};
					data[sid] = {};
				}

				if (key != null)
					return data[sid].hasOwnProperty(key) ? data[sid][key] : null;

				return data[sid];
			}
			catch (e) {
				return (key != null) ? null : {};
			}
		},

}
