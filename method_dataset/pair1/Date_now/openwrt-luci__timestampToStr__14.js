function timestampToStr(timestamp) {
	if (timestamp < 1)
		return _('Never', 'No WireGuard peer handshake yet');

	var seconds = (Date.now() / 1000) - timestamp;
	var ago;

	if (seconds < 60)
		ago = _('%ds ago').format(seconds);
	else if (seconds < 3600)
		ago = _('%dm ago').format(seconds / 60);
	else if (seconds < 86401)
		ago = _('%dh ago').format(seconds / 3600);
	else
		ago = _('over a day ago');

	return (new Date(timestamp * 1000)).toUTCString() + ' (' + ago + ')';
}
