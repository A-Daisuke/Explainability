    function FuzzyMatch(pattern) {
      var _this;
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$location = _ref.location,
        location = _ref$location === void 0 ? Config.location : _ref$location,
        _ref$threshold = _ref.threshold,
        threshold = _ref$threshold === void 0 ? Config.threshold : _ref$threshold,
        _ref$distance = _ref.distance,
        distance = _ref$distance === void 0 ? Config.distance : _ref$distance,
        _ref$includeMatches = _ref.includeMatches,
        includeMatches = _ref$includeMatches === void 0 ? Config.includeMatches : _ref$includeMatches,
        _ref$findAllMatches = _ref.findAllMatches,
        findAllMatches = _ref$findAllMatches === void 0 ? Config.findAllMatches : _ref$findAllMatches,
        _ref$minMatchCharLeng = _ref.minMatchCharLength,
        minMatchCharLength = _ref$minMatchCharLeng === void 0 ? Config.minMatchCharLength : _ref$minMatchCharLeng,
        _ref$isCaseSensitive = _ref.isCaseSensitive,
        isCaseSensitive = _ref$isCaseSensitive === void 0 ? Config.isCaseSensitive : _ref$isCaseSensitive,
        _ref$ignoreDiacritics = _ref.ignoreDiacritics,
        ignoreDiacritics = _ref$ignoreDiacritics === void 0 ? Config.ignoreDiacritics : _ref$ignoreDiacritics,
        _ref$ignoreLocation = _ref.ignoreLocation,
        ignoreLocation = _ref$ignoreLocation === void 0 ? Config.ignoreLocation : _ref$ignoreLocation;
      _classCallCheck(this, FuzzyMatch);
      _this = _super.call(this, pattern);
      _this._bitapSearch = new BitapSearch(pattern, {
        location: location,
        threshold: threshold,
        distance: distance,
        includeMatches: includeMatches,
        findAllMatches: findAllMatches,
        minMatchCharLength: minMatchCharLength,
        isCaseSensitive: isCaseSensitive,
        ignoreDiacritics: ignoreDiacritics,
        ignoreLocation: ignoreLocation
      });
      return _this;
    }
