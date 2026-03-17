class __C__ {
  load(self, options, elementId) {
    // chosen element to manipulate text
    if (typeof elementId === 'string') {
      self.el = document.querySelector(elementId);
    } else {
      self.el = elementId;
    }

    self.options = { ...defaults, ...options };

    // attribute to type into
    self.isInput = self.el.tagName.toLowerCase() === 'input';
    self.attr = self.options.attr;
    self.bindInputFocusEvents = self.options.bindInputFocusEvents;

    // show cursor
    self.showCursor = self.isInput ? false : self.options.showCursor;

    // custom cursor
    self.cursorChar = self.options.cursorChar;

    // Is the cursor blinking
    self.cursorBlinking = true;

    // text content of element
    self.elContent = self.attr
      ? self.el.getAttribute(self.attr)
      : self.el.textContent;

    // html or plain text
    self.contentType = self.options.contentType;

    // typing speed
    self.typeSpeed = self.options.typeSpeed;

    // add a delay before typing starts
    self.startDelay = self.options.startDelay;

    // backspacing speed
    self.backSpeed = self.options.backSpeed;

    // only backspace what doesn't match the previous string
    self.smartBackspace = self.options.smartBackspace;

    // amount of time to wait before backspacing
    self.backDelay = self.options.backDelay;

    // Fade out instead of backspace
    self.fadeOut = self.options.fadeOut;
    self.fadeOutClass = self.options.fadeOutClass;
    self.fadeOutDelay = self.options.fadeOutDelay;

    // variable to check whether typing is currently paused
    self.isPaused = false;

    // input strings of text
    self.strings = self.options.strings.map((s) => s.trim());

    // div containing strings
    if (typeof self.options.stringsElement === 'string') {
      self.stringsElement = document.querySelector(self.options.stringsElement);
    } else {
      self.stringsElement = self.options.stringsElement;
    }

    if (self.stringsElement) {
      self.strings = [];
      self.stringsElement.style.cssText =
        'clip: rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px;';

      const strings = Array.prototype.slice.apply(self.stringsElement.children);
      const stringsLength = strings.length;

      if (stringsLength) {
        for (let i = 0; i < stringsLength; i += 1) {
          const stringEl = strings[i];
          self.strings.push(stringEl.innerHTML.trim());
        }
      }
    }

    // character number position of current string
    self.strPos = 0;

    // If there is some text in the element
    self.currentElContent = this.getCurrentElContent(self);

    if (self.currentElContent && self.currentElContent.length > 0) {
      self.strPos = self.currentElContent.length - 1;
      self.strings.unshift(self.currentElContent);
    }

    // the order of strings
    self.sequence = [];

    // Set the order in which the strings are typed
    for (let i in self.strings) {
      self.sequence[i] = i;
    }

    // current array position
    self.arrayPos = 0;

    // index of string to stop backspacing on
    self.stopNum = 0;

    // Looping logic
    self.loop = self.options.loop;
    self.loopCount = self.options.loopCount;
    self.curLoop = 0;

    // shuffle the strings
    self.shuffle = self.options.shuffle;

    self.pause = {
      status: false,
      typewrite: true,
      curString: '',
      curStrPos: 0,
    };

    // When the typing is complete (when not looped)
    self.typingComplete = false;

    self.autoInsertCss = self.options.autoInsertCss;

    if (self.autoInsertCss) {
      this.appendCursorAnimationCss(self);
      this.appendFadeOutAnimationCss(self);
    }
  }

}
