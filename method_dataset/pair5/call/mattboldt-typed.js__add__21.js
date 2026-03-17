function __method_wrapper__() {
  this.add = function(selector) {
    var elements,
        elsWithIds,
        idList,
        elementID,
        i,
        roughText,
        tidyText,
        index,
        count,
        newTidyText,
        readableID,
        anchor;

    this._applyRemainingDefaultOptions(this.options);

    // Provide a sensible default selector, if none is given.
    if (!selector) {
      selector = 'h1, h2, h3, h4, h5, h6';
    } else if (typeof selector !== 'string') {
      throw new Error('The selector provided to AnchorJS was invalid.');
    }

    elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      return false;
    }

    this._addBaselineStyles();

    // We produce a list of existing IDs so we don't generate a duplicate.
    elsWithIds = document.querySelectorAll('[id]');
    idList = [].map.call(elsWithIds, function assign(el) {
      return el.id;
    });

    for (i = 0; i < elements.length; i++) {

      if (elements[i].hasAttribute('id')) {
        elementID = elements[i].getAttribute('id');
      } else {
        roughText = elements[i].textContent;

        // Refine it so it makes a good ID. Strip out non-safe characters, replace
        // spaces with hyphens, truncate to 32 characters, and make toLowerCase.
        //
        // Example string:                                // '⚡⚡⚡ Unicode icons are cool--but they definitely don't belong in a URL fragment.'
        tidyText = roughText.replace(/[^\w\s-]/gi, '')    // ' Unicode icons are cool--but they definitely dont belong in a URL fragment'
                                .replace(/\s+/g, '-')     // '-Unicode-icons-are-cool--but-they-definitely-dont-belong-in-a-URL-fragment'
                                .replace(/-{2,}/g, '-')   // '-Unicode-icons-are-cool-but-they-definitely-dont-belong-in-a-URL-fragment'
                                .substring(0, 64)         // '-Unicode-icons-are-cool-but-they-definitely-dont-belong-in-a-URL'
                                .replace(/^-+|-+$/gm, '') // 'Unicode-icons-are-cool-but-they-definitely-dont-belong-in-a-URL'
                                .toLowerCase();           // 'unicode-icons-are-cool-but-they-definitely-dont-belong-in-a-url'

        // Compare our generated ID to existing IDs (and increment it if needed)
        // before we add it to the page.
        newTidyText = tidyText;
        count = 0;
        do {
          if (index !== undefined) {
            newTidyText = tidyText + '-' + count;
          }
          // .indexOf is supported in IE9+.
          index = idList.indexOf(newTidyText);
          count += 1;
        } while (index !== -1);
        index = undefined;
        idList.push(newTidyText);

        // Assign it to our element.
        // Currently the setAttribute element is only supported in IE9 and above.
        elements[i].setAttribute('id', newTidyText);

        elementID = newTidyText;
      }

      readableID = elementID.replace(/-/g, ' ');

      // The following code builds the following DOM structure in a more effiecient (albeit opaque) way.
      // '<a class="anchorjs-link ' + this.options.class + '" href="#' + elementID + '" aria-label="Anchor link for: ' + readableID + '" data-anchorjs-icon="' + this.options.icon + '"></a>';
      anchor = document.createElement('a');
      anchor.className = 'anchorjs-link ' + this.options.class;
      anchor.href = '#' + elementID;
      anchor.setAttribute('aria-label', 'Anchor link for: ' + readableID);
      anchor.setAttribute('data-anchorjs-icon', this.options.icon);

      if (this.options.visible === 'always') {
        anchor.style.opacity = '1';
      }

      if (this.options.icon === '\ue9cb') {
        anchor.style.fontFamily = 'anchorjs-icons';
        anchor.style.fontStyle = 'normal';
        anchor.style.fontVariant = 'normal';
        anchor.style.fontWeight = 'normal';
        anchor.style.lineHeight = 1;
      }

      if (this.options.placement === 'left') {
        anchor.style.position = 'absolute';
        anchor.style.marginLeft = '-1em';
        anchor.style.paddingRight = '0.5em';
        elements[i].insertBefore(anchor, elements[i].firstChild);
      } else { // if the option provided is `right` (or anything else).
        anchor.style.paddingLeft = '0.375em';
        elements[i].appendChild(anchor);
      }
    }

    return this;
  };

}
