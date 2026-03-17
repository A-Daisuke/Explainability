function __method_wrapper__() {
	DOMPurify.sanitize = function (dirty) {
		let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		let body;
		let importedNode;
		let currentNode;
		let returnNode;
		/* Make sure we have a string to sanitize.
			DO NOT return early, as this will return the wrong type if
			the user has requested a DOM object rather than a string */

		IS_EMPTY_INPUT = !dirty;

		if (IS_EMPTY_INPUT) {
			dirty = '<!-->';
		}
		/* Stringify, in case dirty is an object */


		if (typeof dirty !== 'string' && !_isNode(dirty)) {
			if (typeof dirty.toString === 'function') {
				dirty = dirty.toString();

				if (typeof dirty !== 'string') {
					throw typeErrorCreate('dirty is not a string, aborting');
				}
			} else {
				throw typeErrorCreate('toString is not a function');
			}
		}
		/* Return dirty HTML if DOMPurify cannot run */


		if (!DOMPurify.isSupported) {
			return dirty;
		}
		/* Assign config vars */


		if (!SET_CONFIG) {
			_parseConfig(cfg);
		}
		/* Clean up removed elements */


		DOMPurify.removed = [];
		/* Check if dirty is correctly typed for IN_PLACE */

		if (typeof dirty === 'string') {
			IN_PLACE = false;
		}

		if (IN_PLACE) {
			/* Do some early pre-sanitization to avoid unsafe root nodes */
			if (dirty.nodeName) {
				const tagName = transformCaseFunc(dirty.nodeName);

				if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
					throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
				}
			}
		} else if (dirty instanceof Node) {
			/* If dirty is a DOM element, append to an empty document to avoid
				 elements being stripped by the parser */
			body = _initDocument('<!---->');
			importedNode = body.ownerDocument.importNode(dirty, true);

			if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
				/* Node is already a body, use as is */
				body = importedNode;
			} else if (importedNode.nodeName === 'HTML') {
				body = importedNode;
			} else {
				// eslint-disable-next-line unicorn/prefer-dom-node-append
				body.appendChild(importedNode);
			}
		} else {
			/* Exit directly if we have nothing to do */
			if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
				dirty.indexOf('<') === -1) {
				return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
			}
			/* Initialize the document to work on */


			body = _initDocument(dirty);
			/* Check we have a DOM node from the data */

			if (!body) {
				return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
			}
		}
		/* Remove first element node (ours) if FORCE_BODY is set */


		if (body && FORCE_BODY) {
			_forceRemove(body.firstChild);
		}
		/* Get node iterator */


		const nodeIterator = _createIterator(IN_PLACE ? dirty : body);
		/* Now start iterating over the created document */


		while (currentNode = nodeIterator.nextNode()) {
			/* Sanitize tags and elements */
			if (_sanitizeElements(currentNode)) {
				continue;
			}
			/* Shadow DOM detected, sanitize it */


			if (currentNode.content instanceof DocumentFragment) {
				_sanitizeShadowDOM(currentNode.content);
			}
			/* Check attributes, sanitize if necessary */


			_sanitizeAttributes(currentNode);
		}
		/* If we sanitized `dirty` in-place, return it. */


		if (IN_PLACE) {
			return dirty;
		}
		/* Return sanitized string or DOM */


		if (RETURN_DOM) {
			if (RETURN_DOM_FRAGMENT) {
				returnNode = createDocumentFragment.call(body.ownerDocument);

				while (body.firstChild) {
					// eslint-disable-next-line unicorn/prefer-dom-node-append
					returnNode.appendChild(body.firstChild);
				}
			} else {
				returnNode = body;
			}

			if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
				/*
					AdoptNode() is not used because internal state is not reset
					(e.g. the past names map of a HTMLFormElement), this is safe
					in theory but we would rather not risk another attack vector.
					The state that is cloned by importNode() is explicitly defined
					by the specs.
				*/
				returnNode = importNode.call(originalDocument, returnNode, true);
			}

			return returnNode;
		}

		let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
		/* Serialize doctype if allowed */

		if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
			serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
		}
		/* Sanitize final string template-safe */


		if (SAFE_FOR_TEMPLATES) {
			serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR, ' ');
			serializedHTML = stringReplace(serializedHTML, ERB_EXPR, ' ');
			serializedHTML = stringReplace(serializedHTML, TMPLIT_EXPR, ' ');
		}

		return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
	};

}
