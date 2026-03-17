function __method_wrapper__() {
			.then(arrayBuffer => {
				const uint8Array = new Uint8Array(arrayBuffer);
				self.fileData = uint8Array;
				self.fileContent = ''; // Can be used for display or left empty
				self.editorMode = 'hex';
				self.textType = self.isText(uint8Array) ? 'text' : 'hex';
				if (mode === 'text') {
					// Determine if the file is text
					if (self.textType === 'text') {
						// If text, decode the content
						self.fileContent = new TextDecoder().decode(uint8Array);
						self.editorMode = 'text';
					} else {
						// If not text, show a warning and set mode to hex
						if (editorMessage) {
							editorMessage.textContent = _('The file does not contain valid text data. Opening in hex mode...');
						}
						pop(null, E('p', _('Opening file in hex mode since it is not a text file.')), 'warning');
					}
				}
			})

}
