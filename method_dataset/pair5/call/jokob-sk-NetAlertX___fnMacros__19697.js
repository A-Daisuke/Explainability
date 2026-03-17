	function _fnMacros ( settings, str, entries )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is
		// used only internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			max        = settings.fnRecordsTotal(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, max ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) ).
			replace(/_ENTRIES_/g, settings.api.i18n('entries', '', entries) ).
			replace(/_ENTRIES-MAX_/g, settings.api.i18n('entries', '', max) ).
			replace(/_ENTRIES-TOTAL_/g, settings.api.i18n('entries', '', vis) );
	}
