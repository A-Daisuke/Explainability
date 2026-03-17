		function _start_stream() {
			console.log('_start_stream');

			var port = uci.get('mjpg-streamer', 'core', 'port');

			if (uci.get('mjpg-streamer', 'core', 'enable_auth') == '1') {
				var user = uci.get('mjpg-streamer', 'core', 'username');
				var pass = uci.get('mjpg-streamer', 'core', 'password');
				var login = user + ':' + pass + '@';
			} else {
				var login = '';
			}

			var img = document.getElementById('video_preview') || video_preview;
			img.src = 'http://' + login + location.hostname + ':' + port + '/?action=snapshot' + '&t=' + new Date().getTime();
		}
