function __method_wrapper__() {
  $(window).on(Event$1.LOAD_DATA_API, function () {
    // ensure correct active class is set to match the controls' actual values/states
    // find all checkboxes/readio buttons inside data-toggle groups
    var buttons = [].slice.call(document.querySelectorAll(Selector$1.DATA_TOGGLES_BUTTONS));

    for (var i = 0, len = buttons.length; i < len; i++) {
      var button = buttons[i];
      var input = button.querySelector(Selector$1.INPUT);

      if (input.checked || input.hasAttribute('checked')) {
        button.classList.add(ClassName$1.ACTIVE);
      } else {
        button.classList.remove(ClassName$1.ACTIVE);
      }
    } // find all button toggles


    buttons = [].slice.call(document.querySelectorAll(Selector$1.DATA_TOGGLE));

    for (var _i = 0, _len = buttons.length; _i < _len; _i++) {
      var _button = buttons[_i];

      if (_button.getAttribute('aria-pressed') === 'true') {
        _button.classList.add(ClassName$1.ACTIVE);
      } else {
        _button.classList.remove(ClassName$1.ACTIVE);
      }
    }
  });

}
