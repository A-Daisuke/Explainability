var initDemo = function(sandbox) {
  var params = util.parseQueryString(window.location.href);

  // being the smart programmer I am (not), I don't include a true value on demo, so
  // I have to check if the key exists here
  var commands;
  if (/(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent) || /android/i.test(navigator.userAgent)) {
    sandbox.mainVis.customEvents.on('gitEngineReady', function() {
      eventBaton.trigger('commandSubmitted', 'mobile alert');
    });
  }

  if (params.hasOwnProperty('demo')) {
    commands = [
      "git commit; git checkout -b bugFix C1; git commit; git merge main; git checkout main; git commit; git rebase bugFix;",
      "delay 1000; reset;",
      "level advanced1 --noFinishDialog --noStartCommand --noIntroDialog;",
      "delay 2000; show goal; delay 1000; hide goal;",
      "git checkout bugFix; git rebase main; git checkout side; git rebase bugFix;",
      "git checkout another; git rebase side; git rebase another main;",
      "help; levels"
    ];
  } else if (params.hasOwnProperty('hgdemo')) {
    commands = [
      'importTreeNow {"branches":{"main":{"target":"C3","id":"main"},"feature":{"target":"C2","id":"feature"},"debug":{"target":"C4","id":"debug"}},"commits":{"C0":{"parents":[],"id":"C0","rootCommit":true},"C1":{"parents":["C0"],"id":"C1"},"C2":{"parents":["C1"],"id":"C2"},"C3":{"parents":["C1"],"id":"C3"},"C4":{"parents":["C2"],"id":"C4"}},"HEAD":{"target":"feature","id":"HEAD"}}',
      'delay 1000',
      'git rebase main',
      'delay 1000',
      'undo',
      'hg book',
      'delay 1000',
      'hg rebase -d main'
    ];
    commands = commands.join(';#').split('#'); // hax
  } else if (params.hasOwnProperty('hgdemo2')) {
    commands = [
      'importTreeNow {"branches":{"main":{"target":"C3","id":"main"},"feature":{"target":"C2","id":"feature"},"debug":{"target":"C4","id":"debug"}},"commits":{"C0":{"parents":[],"id":"C0","rootCommit":true},"C1":{"parents":["C0"],"id":"C1"},"C2":{"parents":["C1"],"id":"C2"},"C3":{"parents":["C1"],"id":"C3"},"C4":{"parents":["C2"],"id":"C4"}},"HEAD":{"target":"debug","id":"HEAD"}}',
      'delay 1000',
      'git rebase main',
      'delay 1000',
      'undo',
      'hg sum',
      'delay 1000',
      'hg rebase -d main'
    ];
    commands = commands.join(';#').split('#'); // hax
  } else if (params.hasOwnProperty('remoteDemo')) {
    commands = [
      'git clone',
      'git commit',
      'git fakeTeamwork',
      'git pull',
      'git push',
      'git commit',
      'git fakeTeamwork',
      'git pull --rebase',
      'git push',
      'levels'
    ];
    commands = commands.join(';#').split('#'); // hax
  } else if (params.hasOwnProperty('level')) {
    commands = [
      'level ' + unescape(params.level),
    ];
  } else if (params.gist_level_id) {
    $.ajax({
      url: 'https://api.github.com/gists/' + params.gist_level_id,
      type: 'GET',
      dataType: 'jsonp',
      success: function(response) {
        var data = response.data || {};
        var files = data.files || {};
        if (!Object.keys(files).length) {
          console.warn('no files found');
          return;
        }
        var file = files[Object.keys(files)[0]];
        if (!file.content) {
          console.warn('file empty');
        }
        eventBaton.trigger(
          'commandSubmitted',
          'importLevelNow ' + escape(file.content) + '; clear; show goal;'
        );
      }
    });
  } else if (!params.hasOwnProperty('NODEMO')) {
    commands = [
      "help;",
      "levels"
    ];
  }
  if (params.hasOwnProperty('STARTREACT')) {
    /*
    ReactDOM.render(
      React.createElement(CommandView, {}),
      document.getElementById(params['STARTREACT'])
      );*/
  }
  if (commands) {
    sandbox.mainVis.customEvents.on('gitEngineReady', function() {
      eventBaton.trigger('commandSubmitted', commands.join(''));
    });
  }

  if (params.locale !== undefined && params.locale.length) {
    LocaleActions.changeLocaleFromURI(params.locale);
  } else {
    tryLocaleDetect();
  }

  insertAlternateLinks();

  if (params.command) {
    var command = unescape(params.command);
    sandbox.mainVis.customEvents.on('gitEngineReady', function() {
      eventBaton.trigger('commandSubmitted', command);
    });
  }

};
