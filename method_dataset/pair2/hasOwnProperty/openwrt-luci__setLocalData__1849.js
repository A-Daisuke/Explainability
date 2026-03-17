function __method_wrapper__() {
		setLocalData(key, value) {
			if (key == null)
				return false;

			try {
				const sid = this.getID();
				const item = 'luci-session-store';
				let data = JSON.parse(window.sessionStorage.getItem(item));

				if (!LuCI.prototype.isObject(data) || !data.hasOwnProperty(sid)) {
					data = {};
					data[sid] = {};
				}

				if (value != null)
					data[sid][key] = value;
				else
					delete data[sid][key];

				window.sessionStorage.setItem(item, JSON.stringify(data));

				return true;
			}
			catch (e) {
				return false;
			}
		}

}
