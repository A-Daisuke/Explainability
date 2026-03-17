class __C__ {
	constructor(hexeditDomObject) {
		this.hexedit = _fillHexeditDom(hexeditDomObject);
		this.offsets = this.hexedit.querySelector('.offsets');
		this.hexview = this.hexedit.querySelector('.hexview');
		this.textview = this.hexedit.querySelector('.textview');
		this.hexeditContent = this.hexedit.querySelector('.hexedit-content');
		this.hexeditHeaders = this.hexedit.querySelector('.hexedit-headers'); // Reference to headers

		this.bytesPerRow = 16;
		this.startIndex = 0; // Starting index for virtual scrolling
		this.data = new Uint8Array(0); // Initialize with empty data

		this.selectedIndex = null; // Currently selected byte index
		this.editHex = true; // Flag to determine edit mode (hex or text)
		this.currentEdit = ""; // Current edit buffer
		this.readonly = false; // Read-only mode flag
		this.ctrlPressed = false; // Control key pressed flag

		this.matches = []; // Array to store all match positions and lengths
		this.currentMatchIndex = -1; // Index of the current match
		this.currentSearchType = null; // Current search type ('ascii', 'hex', 'regex')
		this.activeView = null; // Active view based on focus ('hex' or 'text')
		this.previousSelectedIndex = null; // To track previous selection for color restoration

		// Storage of the last search pattern for each search type
		this.lastSearchPatterns = {
			ascii: '',
			hex: '',
			regex: ''
		};

		this._registerEventHandlers();

		// Initialize ResizeObserver for dynamic row calculation
		this.resizeObserver = new ResizeObserver(() => {
			this.calculateVisibleRows();
		});
		this.resizeObserver.observe(this.hexeditContent);

		// Initialize Search Functionality
		this.addSearchUI();
	}

}
