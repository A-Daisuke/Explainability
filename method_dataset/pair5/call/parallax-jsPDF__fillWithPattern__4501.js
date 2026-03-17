    var fillWithPattern = function fillWithPattern(patternData, style) {
      var patternId = patternMap[patternData.key];
      var pattern = patterns[patternId];
      if (pattern instanceof ShadingPattern) {
        out("q");
        out(clipRuleFromStyle(style));
        if (pattern.gState) {
          API.setGState(pattern.gState);
        }
        out(patternData.matrix.toString() + " cm");
        out("/" + patternId + " sh");
        out("Q");
      } else if (pattern instanceof TilingPattern) {
        // pdf draws patterns starting at the bottom left corner and they are not affected by the global transformation,
        // so we must flip them
        var matrix = new Matrix(1, 0, 0, -1, 0, getPageHeight());
        if (patternData.matrix) {
          matrix = matrix.multiply(patternData.matrix || identityMatrix);
          // we cannot apply a matrix to the pattern on use so we must abuse the pattern matrix and create new instances
          // for each use
          patternId = cloneTilingPattern.call(pattern, patternData.key, patternData.boundingBox, patternData.xStep, patternData.yStep, matrix).id;
        }
        out("q");
        out("/Pattern cs");
        out("/" + patternId + " scn");
        if (pattern.gState) {
          API.setGState(pattern.gState);
        }
        out(style);
        out("Q");
      }
    };
