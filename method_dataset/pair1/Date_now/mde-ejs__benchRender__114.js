function benchRender(name, file, data, opts, benchOpts) {
  ejs.cache.reset();
  var runTimes = [];
  opts = opts || {};
  benchOpts = benchOpts || {};
  opts.filename = file;
  var totalLoops = Math.round(loops * (benchOpts.loopFactor || 1));
  var tmpl = files[file];
  for (var r = 0; r < runs; r++) {
    ejs.render(tmpl, data, opts); // one run in advance

    var t = Date.now();
    for (var i = 0; i < totalLoops; i++) {
      ejs.render(tmpl, data, opts);
    }
    t = Date.now() - t;
    runTimes.push(t);
  }
  log(name, runTimes, totalLoops);
}
