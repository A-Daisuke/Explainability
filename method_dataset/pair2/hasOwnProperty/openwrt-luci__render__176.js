function __method_wrapper__() {
	render: function(data) {
		ui.addNotification(null, E('p', [
			_('The LuCI ACL management is in an experimental stage! It does not yet work reliably with all applications')
		]), 'warning');

		var has_uhttpd = data[0],
		    known_unix_users = {};

		for (var i = 0; i < data[1].length; i++) {
			var parts = data[1][i].split(/:/);

			if (parts.length >= 7)
				known_unix_users[parts[0]] = true;
		}

		for (var i = 2; i < data.length; i++) {
			if (!L.isObject(data[i]))
				continue;

			for (var aclName in data[i]) {
				if (!data[i].hasOwnProperty(aclName))
					continue;

				aclList[aclName] = data[i][aclName];
			}
		}

		let m, s, o;

		m = new form.Map('rpcd', _('LuCI Logins'));

		s = m.section(form.GridSection, 'login');
		s.anonymous = true;
		s.addremove = true;

		s.modaltitle = function(section_id) {
			return _('LuCI Logins') + ' » ' + (uci.get('rpcd', section_id, 'username') || _('New account'));
		};

		o = s.option(form.Value, 'username', _('Login name'));
		o.rmempty = false;

		o = s.option(form.ListValue, '_variant', _('Password variant'));
		o.modalonly = true;
		o.value('shadow', _('Use UNIX password in /etc/shadow'));
		o.value('crypted', _('Use encrypted password hash'));
		o.cfgvalue = function(section_id) {
			var value = uci.get('rpcd', section_id, 'password') || '';

			if (value.substring(0, 3) == '$p$')
				return 'shadow';
			else
				return 'crypted';
		};
		o.write = function() {};

		o = s.option(widgets.UserSelect, '_account', _('UNIX account'), _('The system account to use the password from'));
		o.modalonly = true;
		o.depends('_variant', 'shadow');
		o.cfgvalue = function(section_id) {
			var value = uci.get('rpcd', section_id, 'password') || '';
			return value.substring(3);
		};
		o.write = function(section_id, value) {
			uci.set('rpcd', section_id, 'password', '$p$' + value);
		};
		o.remove = function() {};

		o = s.option(form.Value, 'password', _('Password value'));
		o.modalonly = true;
		o.password = true;
		o.rmempty = false;
		o.depends('_variant', 'crypted');
		o.cfgvalue = function(section_id) {
			var value = uci.get('rpcd', section_id, 'password') || '';
			return (value.substring(0, 3) == '$p$') ? '' : value;
		};
		o.validate = function(section_id, value) {
			var variant = this.map.lookupOption('_variant', section_id)[0];

			switch (value.substring(0, 3)) {
			case '$p$':
				return _('The password may not start with "$p$".');

			case '$1$':
				variant.getUIElement(section_id).setValue('crypted');
				break;

			default:
				if (variant.formvalue(section_id) == 'crypted' && value.length && !has_uhttpd)
					return _('Cannot encrypt plaintext password since uhttpd is not installed.');
			}

			return true;
		};
		o.write = function(section_id, value) {
			var variant = this.map.lookupOption('_variant', section_id)[0];

			if (variant.formvalue(section_id) == 'crypted' && value.substring(0, 3) != '$1$')
				return fs.exec('/usr/sbin/uhttpd', [ '-m', value ]).then(function(res) {
					if (res.code == 0 && res.stdout)
						uci.set('rpcd', section_id, 'password', res.stdout.trim());
					else
						throw new Error(res.stderr);
				}).catch(function(err) {
					throw new Error(_('Unable to encrypt plaintext password: %s').format(err.message));
				});

			uci.set('rpcd', section_id, 'password', value);
		};
		o.remove = function() {};

		o = s.option(form.Value, 'timeout', _('Session timeout'));
		o.default = '300';
		o.datatype = 'uinteger';
		o.textvalue = function(section_id) {
			var value = uci.get('rpcd', section_id, 'timeout') || this.default;
			return +value ? '%ds'.format(value) : E('em', [ _('does not expire') ]);
		};

		o = s.option(cbiACLLevel, '_read', _('Read access'));
		o.modalonly = false;

		o = s.option(cbiACLLevel, '_write', _('Write access'));
		o.modalonly = false;

		o = s.option(form.ListValue, '_level', _('Access level'));
		o.modalonly = true;
		o.value('write', _('full', 'All permissions granted'));
		o.value('read', _('readonly', 'Only read permissions granted'));
		o.value('individual', _('individual', 'Select individual permissions manually'));
		o.cfgvalue = function(section_id) {
			var readList = L.toArray(uci.get('rpcd', section_id, 'read')),
			    writeList = L.toArray(uci.get('rpcd', section_id, 'write'));

			if (writeList.length == 1 && writeList[0] == '*')
				return 'write';
			else if (readList.length == 1 && readList[0] == '*')
				return 'read';
			else
				return 'individual';
		};
		o.write = function(section_id) {
			switch (this.formvalue(section_id)) {
			case 'write':
				uci.set('rpcd', section_id, 'read', ['*']);
				uci.set('rpcd', section_id, 'write', ['*']);
				break;

			case 'read':
				uci.set('rpcd', section_id, 'read', ['*']);
				uci.unset('rpcd', section_id, 'write');
				break;
			}
		};
		o.remove = function() {};

		o = s.option(cbiACLSelect, '_acl');
		o.modalonly = true;
		o.depends('_level', 'individual');

		return m.render();
	}

}
