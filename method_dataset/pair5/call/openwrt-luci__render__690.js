const __obj__ = {
	render: function(data) {
		var self = this;
		insertCss(cssContent); // Insert CSS styles
		//		insertCss(hexeditCssContent); // Insert hexedit CSS styles
		var viewContainer = E('div', {
			'id': 'file-manager-container'
		}, [
			// File Manager Header
			E('div', {
				'class': 'file-manager-header'
			}, [
				E('h2', {}, _('File Manager: ')),
				E('input', {
					'type': 'text',
					'id': 'path-input',
					'value': currentPath,
					'style': 'margin-left: 10px;',
					'keydown': function(event) {
						if (event.key === 'Enter') {
							self.handleGoButtonClick(); // Trigger directory navigation on Enter
						}
					}
				}),
				E('button', {
					'id': 'go-button',
					'click': this.handleGoButtonClick.bind(this),
					'style': 'margin-left: 10px;'
				}, _('Go'))
			]),

			// Tab Panels
			E('div', {
				'class': 'cbi-tabcontainer',
				'id': 'tab-group'
			}, [
				E('ul', {
					'class': 'cbi-tabmenu'
				}, [
					E('li', {
						'class': 'cbi-tab cbi-tab-active',
						'id': 'tab-filemanager'
					}, [
						E('a', {
							'href': '#',
							'click': this.switchToTab.bind(this, 'filemanager')
						}, _('File Manager'))
					]),
					E('li', {
						'class': 'cbi-tab',
						'id': 'tab-editor'
					}, [
						E('a', {
							'href': '#',
							'click': this.switchToTab.bind(this, 'editor')
						}, _('Editor'))
					]),
					E('li', {
						'class': 'cbi-tab',
						'id': 'tab-settings'
					}, [
						E('a', {
							'href': '#',
							'click': this.switchToTab.bind(this, 'settings')
						}, _('Settings'))
					]),
					// Help Tab
					E('li', {
						'class': 'cbi-tab',
						'id': 'tab-help'
					}, [
						E('a', {
							'href': '#',
							'click': this.switchToTab.bind(this, 'help')
						}, _('Help'))
					])
				])
			]),

			// Tab Contents
			E('div', {
				'class': 'cbi-tabcontainer-content'
			}, [
				// File Manager Content
				E('div', {
					'id': 'content-filemanager',
					'class': 'cbi-tab',
					'style': 'display:block;'
				}, [
					// File List Container with Drag-and-Drop
					(function() {
						// Create the container for the file list and drag-and-drop functionality
						var fileListContainer = E('div', {
							'id': 'file-list-container',
							'class': 'resizable',
							'style': 'width: ' + config.windowSizes.width + 'px; height: ' + config.windowSizes.height + 'px;'
						}, [
							E('table', {
								'class': 'table',
								'id': 'file-table'
							}, [
								E('thead', {}, [
									E('tr', {}, [
										E('th', {
											'data-field': 'name'
										}, [
											_('Name'),
											E('button', {
												'class': 'sort-button',
												'data-field': 'name',
												'title': _('Sort by Name')
											}, '↕'),
											E('div', {
												'class': 'resizer'
											})
										]),
										E('th', {
											'data-field': 'type'
										}, [
											_('Type'),
											E('button', {
												'class': 'sort-button',
												'data-field': 'type',
												'title': _('Sort by Type')
											}, '↕'),
											E('div', {
												'class': 'resizer'
											})
										]),
										E('th', {
											'data-field': 'size'
										}, [
											_('Size'),
											E('button', {
												'class': 'sort-button',
												'data-field': 'size',
												'title': _('Sort by Size')
											}, '↕'),
											E('div', {
												'class': 'resizer'
											})
										]),
										E('th', {
											'data-field': 'mtime'
										}, [
											_('Last Modified'),
											E('button', {
												'class': 'sort-button',
												'data-field': 'mtime',
												'title': _('Sort by Last Modified')
											}, '↕'),
											E('div', {
												'class': 'resizer'
											})
										]),
										E('th', {}, [
											E('input', {
												'type': 'checkbox',
												'id': 'select-all-checkbox',
												'style': 'margin-right: 5px;',
												'change': this.handleSelectAllChange.bind(this),
												'click': this.handleSelectAllClick.bind(this)
											}),
											_('Actions')
										])
									])
								]),
								E('tbody', {
									'id': 'file-list'
								})
							]),
							E('div', {
								'id': 'drag-overlay',
								'style': 'display:none;'
							}, _('Drop files here to upload'))
						]);

						// Attach drag-and-drop event listeners
						fileListContainer.addEventListener('dragenter', this.handleDragEnter.bind(this));
						fileListContainer.addEventListener('dragover', this.handleDragOver.bind(this));
						fileListContainer.addEventListener('dragleave', this.handleDragLeave.bind(this));
						fileListContainer.addEventListener('drop', this.handleDrop.bind(this));

						return fileListContainer;
					}).call(this), // Ensure 'this' context is preserved

					// Status Bar
					E('div', {
						'id': 'status-bar'
					}, [
						E('div', {
							'id': 'status-info'
						}, _('No file selected.')),
						E('div', {
							'id': 'status-progress'
						})
					]),

					// Page Actions
					E('div', {
						'class': 'cbi-page-actions'
					}, [
						E('button', {
							'class': 'btn action-button',
							'click': this.handleUploadClick.bind(this)
						}, _('Upload File')),
						E('button', {
							'class': 'btn action-button',
							'click': this.handleMakeDirectoryClick.bind(this)
						}, _('Create Folder')),
						E('button', {
							'class': 'btn action-button',
							'click': this.handleCreateFileClick.bind(this)
						}, _('Create File')),
						E('button', {
							'id': 'delete-selected-button',
							'class': 'btn action-button',
							'style': 'display: none;',
							'click': this.handleDeleteSelected.bind(this)
						}, _('Delete Selected'))
					])
				]),

				// Editor Content
				E('div', {
					'id': 'content-editor',
					'class': 'cbi-tab',
					'style': 'display:none;'
				}, [
					E('p', {
						'id': 'editor-message'
					}, _('Select a file from the list to edit it here.')),
					E('div', {
						'id': 'editor-container'
					})
				]),
				// Help Content
				E('div', {
					'id': 'content-help',
					'class': 'cbi-tab',
					'style': 'display:none; padding: 10px; overflow:auto; width: 650px; height: 600px; resize: both; border: 1px solid #ccc; box-sizing: border-box;'
				}, [
					// The content will be dynamically inserted by renderHelp()
				]),

				// Settings Content
				E('div', {
					'id': 'content-settings',
					'class': 'cbi-tab',
					'style': 'display:none;'
				}, [
					E('div', {
						'style': 'margin-top: 20px;'
					}, [
						E('h3', {}, _('Interface Settings')),
						E('div', {
							'id': 'settings-container'
						}, [
							E('form', {
								'id': 'settings-form'
							}, [
								E('div', {}, [
									E('label', {}, _('Window Width:')),
									E('input', {
										'type': 'number',
										'id': 'window-width-input',
										'value': config.windowSizes.width,
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Window Height:')),
									E('input', {
										'type': 'number',
										'id': 'window-height-input',
										'value': config.windowSizes.height,
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Text Editor Width:')),
									E('input', {
										'type': 'number',
										'id': 'editor-text-width-input',
										'value': config.editorContainerSizes.text.width,
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Text Editor Height:')),
									E('input', {
										'type': 'number',
										'id': 'editor-text-height-input',
										'value': config.editorContainerSizes.text.height,
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Hex Editor Width:')),
									E('input', {
										'type': 'number',
										'id': 'editor-hex-width-input',
										'value': config.editorContainerSizes.hex.width,
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Hex Editor Height:')),
									E('input', {
										'type': 'number',
										'id': 'editor-hex-height-input',
										'value': config.editorContainerSizes.hex.height,
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Column Widths (format: name:width,type:width,...):')),
									E('input', {
										'type': 'text',
										'id': 'column-widths-input',
										'value': Object.keys(config.columnWidths).map(function(field) {
											return field + ':' + config.columnWidths[field];
										}).join(','),
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Column Min Widths (format: name:minWidth,type:minWidth,...):')),
									E('input', {
										'type': 'text',
										'id': 'column-min-widths-input',
										'value': Object.keys(config.columnMinWidths).map(function(field) {
											return field + ':' + config.columnMinWidths[field];
										}).join(','),
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Column Max Widths (format: name:maxWidth,type:maxWidth,...):')),
									E('input', {
										'type': 'text',
										'id': 'column-max-widths-input',
										'value': Object.keys(config.columnMaxWidths).map(function(field) {
											return field + ':' + config.columnMaxWidths[field];
										}).join(','),
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Padding:')),
									E('input', {
										'type': 'number',
										'id': 'padding-input',
										'value': config.padding,
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Padding Min:')),
									E('input', {
										'type': 'number',
										'id': 'padding-min-input',
										'value': config.paddingMin,
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Padding Max:')),
									E('input', {
										'type': 'number',
										'id': 'padding-max-input',
										'value': config.paddingMax,
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {}, [
									E('label', {}, _('Current Directory:')),
									E('input', {
										'type': 'text',
										'id': 'current-directory-input',
										'value': config.currentDirectory,
										'style': 'width:100%; margin-bottom:10px;'
									})
								]),
								E('div', {
									'class': 'cbi-page-actions'
								}, [
									E('button', {
										'class': 'btn cbi-button-save custom-save-button',
										'click': this.handleSaveSettings.bind(this)
									}, _('Save'))
								])
							])
						])
					])
				])
			])
		]);
		// Add event listeners
		var sortButtons = viewContainer.querySelectorAll('.sort-button[data-field]');
		sortButtons.forEach(function(button) {
			button.addEventListener('click', function(event) {
				event.preventDefault();
				var field = button.getAttribute('data-field');
				if (field) {
					self.sortBy(field); // Sort the file list by the selected field
				}
			});
		});
		// Load the file list and initialize resizable columns
		this.loadFileList(currentPath).then(function() {
			self.initResizableColumns();
			var fileListContainer = document.getElementById('file-list-container');
			if (fileListContainer && typeof ResizeObserver !== 'undefined') {
				// Initialize ResizeObserver only once
				if (!self.fileListResizeObserver) {
					self.fileListResizeObserver = new ResizeObserver(function(entries) {
						for (var entry of entries) {
							var newWidth = entry.contentRect.width;
							var newHeight = entry.contentRect.height;

							// Update config only if newWidth and newHeight are greater than 0
							if (newWidth > 0 && newHeight > 0) {
								config.windowSizes.width = newWidth;
								config.windowSizes.height = newHeight;
							}
						}
					});
					self.fileListResizeObserver.observe(fileListContainer);
				}
			}
		});
		return viewContainer;
	},

};
