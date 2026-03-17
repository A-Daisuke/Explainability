function __method_wrapper__() {
	query: function(filter, group, order) {
		var keys = [], columns = {}, records = {}, result = [];

		if (typeof(group) !== 'function' && typeof(group) !== 'object')
			group = ['mac'];

		for (var i = 0; i < trafficData.columns.length; i++)
			columns[trafficData.columns[i]] = i;

		for (var i = 0; i < trafficData.data.length; i++) {
			var record = trafficData.data[i];

			if (typeof(filter) === 'function' && filter(columns, record) !== true)
				continue;

			var key;

			if (typeof(group) === 'function') {
				key = group(columns, record);
			}
			else {
				key = [];

				for (var j = 0; j < group.length; j++)
					if (columns.hasOwnProperty(group[j]))
						key.push(record[columns[group[j]]]);

				key = key.join(',');
			}

			if (!records.hasOwnProperty(key)) {
				var rec = {};

				for (var col in columns)
					rec[col] = record[columns[col]];

				records[key] = rec;
				result.push(rec);
			}
			else {
				records[key].conns    += record[columns.conns];
				records[key].rx_bytes += record[columns.rx_bytes];
				records[key].rx_pkts  += record[columns.rx_pkts];
				records[key].tx_bytes += record[columns.tx_bytes];
				records[key].tx_pkts  += record[columns.tx_pkts];
			}
		}

		if (typeof(order) === 'function')
			result.sort(order);

		return result;
	},

}
