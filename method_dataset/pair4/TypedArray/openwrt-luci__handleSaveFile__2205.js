function __method_wrapper__() {
	handleSaveFile: function(filePath) {
		var self = this;
		var contentBlob;

		if (self.editorMode === 'text') {
			var textarea = document.querySelector('#editor-container textarea');
			if (!textarea) {
				pop(null, E('p', _('Editor textarea not found.')), 'error');
				return;
			}
			var content = textarea.value;
			self.fileContent = content;

			// Convert content to Uint8Array in chunks not exceeding 8KB
			var CHUNK_SIZE = 8 * 1024; // 8KB
			var totalLength = content.length;
			var chunks = [];
			for (var i = 0; i < totalLength; i += CHUNK_SIZE) {
				var chunkStr = content.slice(i, i + CHUNK_SIZE);
				var chunkBytes = new TextEncoder().encode(chunkStr);
				chunks.push(chunkBytes);
			}
			// Concatenate chunks into a single Uint8Array
			var totalBytes = chunks.reduce(function(prev, curr) {
				return prev + curr.length;
			}, 0);
			var dataArray = new Uint8Array(totalBytes);
			var offset = 0;
			chunks.forEach(function(chunk) {
				dataArray.set(chunk, offset);
				offset += chunk.length;
			});
			self.fileData = dataArray; // Update binary data

			contentBlob = new Blob([self.fileData], {
				type: 'application/octet-stream'
			});
		} else if (self.editorMode === 'hex') {
			// Get data from hex editor
			self.fileData = self.hexEditorInstance.getData(); // Assuming getData method is implemented in HexEditor
			contentBlob = new Blob([self.fileData], {
				type: 'application/octet-stream'
			});
		}

		var statusInfo = document.getElementById('status-info');
		var statusProgress = document.getElementById('status-progress');
		var fileName = filePath.split('/').pop();
		if (statusInfo) {
			statusInfo.textContent = _('Saving file: "%s"...').format(fileName);
		}
		if (statusProgress) {
			statusProgress.innerHTML = '';
			var progressBarContainer = E('div', {
				'class': 'cbi-progressbar',
				'title': '0%'
			}, [E('div', {
				'style': 'width:0%'
			})]);
			statusProgress.appendChild(progressBarContainer);
		}

		uploadFile(filePath, contentBlob, function(percent) {
			if (statusProgress) {
				var progressBar = statusProgress.querySelector('.cbi-progressbar div');
				if (progressBar) {
					progressBar.style.width = percent.toFixed(2) + '%';
					statusProgress.querySelector('.cbi-progressbar').setAttribute('title', percent.toFixed(2) + '%');
				}
			}
		}).then(function() {
			var permissions = self.originalFilePermissions;
			if (permissions !== undefined) {
				return fs.exec('chmod', [permissions, filePath]).then(function(res) {
					if (res.code !== 0) {
						throw new Error(res.stderr.trim());
					}
				}).then(function() {
					if (statusInfo) {
						statusInfo.textContent = _('File "%s" uploaded successfully.').format(fileName);
					}
					popTimeout(null, E('p', _('File "%s" uploaded successfully.').format(fileName)), 5000, 'info');
					return self.loadFileList(currentPath).then(function() {
						self.initResizableColumns();
					});
				}).catch(function(err) {
					pop(null, E('p', _('Failed to apply permissions to file "%s": %s').format(fileName, err.message)), 'error');
				});
			} else {
				if (statusInfo) {
					statusInfo.textContent = _('File "%s" uploaded successfully.').format(fileName);
				}
				popTimeout(null, E('p', _('File "%s" uploaded successfully.').format(fileName)), 5000, 'info');
				return self.loadFileList(currentPath).then(function() {
					self.initResizableColumns();
				});
			}
		}).catch(function(err) {
			if (statusProgress) {
				statusProgress.innerHTML = '';
			}
			if (statusInfo) {
				statusInfo.textContent = _('Failed to save file "%s": %s').format(fileName, err.message);
			}
			pop(null, E('p', _('Failed to save file "%s": %s').format(fileName, err.message)), 'error');
		});
	},

}
