	const _initDocument = function _initDocument(dirty) {
		/* Create a HTML document */
		let doc;
		let leadingWhitespace;

		if (FORCE_BODY) {
			dirty = '<remove></remove>' + dirty;
		} else {
			/* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
			const matches = stringMatch(dirty, /^[\r\n\t ]+/);
			leadingWhitespace = matches && matches[0];
		}

		if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
			// Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
			dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
		}

		const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
		/*
		 * Use the DOMParser API by default, fallback later if needs be
		 * DOMParser not work for svg when has multiple root element.
		 */

		if (NAMESPACE === HTML_NAMESPACE) {
			try {
				doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
			} catch (_) { }
		}
		/* Use createHTMLDocument in case DOMParser is not available */


		if (!doc || !doc.documentElement) {
			doc = implementation.createDocument(NAMESPACE, 'template', null);

			try {
				doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
			} catch (_) {// Syntax error if dirtyPayload is invalid xml
			}
		}

		const body = doc.body || doc.documentElement;

		if (dirty && leadingWhitespace) {
			body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
		}
		/* Work on whole document or just its body */


		if (NAMESPACE === HTML_NAMESPACE) {
			return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
		}

		return WHOLE_DOCUMENT ? doc.documentElement : body;
	};
