function resolveVLANPorts(ifname, mapping, seen)
{
	var ports = [];

	if (!seen)
		seen = {};

	if (mapping[ifname]) {
		for (var i = 0; i < mapping[ifname].length; i++) {
			if (!seen[mapping[ifname][i]]) {
				seen[mapping[ifname][i]] = true;
				ports.push.apply(ports, resolveVLANPorts(mapping[ifname][i], mapping, seen));
			}
		}
	}
	else {
		ports.push(ifname);
	}

	return ports.sort(L.naturalCompare);
}
