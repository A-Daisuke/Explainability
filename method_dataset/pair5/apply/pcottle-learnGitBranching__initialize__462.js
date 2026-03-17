function __method_wrapper__() {
  initialize: function(options) {
    options = options || {};
    var nextLevelName = (options.nextLevel) ?
      intl.getName(options.nextLevel) :
      '';

    // lol hax
    var markdowns = intl.getDialog(require('../dialogs/nextLevel'))[0].options.markdowns;
    var markdown = markdowns.join('\n');
    markdown = intl.template(markdown, {
      numCommands: options.numCommands,
      best: options.best
    });

    if (options.numCommands <= options.best) {
      markdown = markdown + '\n\n' + intl.str('finish-dialog-win');
    } else {
      markdown = markdown + '\n\n' + intl.str('finish-dialog-lose', {best: options.best});
    }

    markdown = markdown + '\n\n';
    var extraHTML;
    if (options.nextLevel) {
      markdown = markdown + intl.str('finish-dialog-next', {nextLevel: nextLevelName});
    } else {
      extraHTML = '<p class="catchadream">' + intl.str('finish-dialog-finished') +
        ' (ﾉ^_^)ﾉ (ﾉ^_^)ﾉ (ﾉ^_^)ﾉ' +
        '</p>';
    }

    options = Object.assign(
      {},
      options,
      {
        markdown: markdown,
        _dangerouslyInsertHTML: extraHTML
      }
    );

    NextLevelConfirm.__super__.initialize.apply(this, [options]);
  }

}
