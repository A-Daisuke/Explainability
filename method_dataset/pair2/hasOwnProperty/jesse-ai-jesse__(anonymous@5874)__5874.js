function __method_wrapper__() {
    function(module) {
      var regexp_has_sticky = RegExp.prototype.hasOwnProperty("sticky");
      function InputScanner(input_string) {
        this.__input = input_string || "";
        this.__input_length = this.__input.length;
        this.__position = 0;
      }
      InputScanner.prototype.restart = function() {
        this.__position = 0;
      };
      InputScanner.prototype.back = function() {
        if (this.__position > 0) {
          this.__position -= 1;
        }
      };
      InputScanner.prototype.hasNext = function() {
        return this.__position < this.__input_length;
      };
      InputScanner.prototype.next = function() {
        var val = null;
        if (this.hasNext()) {
          val = this.__input.charAt(this.__position);
          this.__position += 1;
        }
        return val;
      };
      InputScanner.prototype.peek = function(index) {
        var val = null;
        index = index || 0;
        index += this.__position;
        if (index >= 0 && index < this.__input_length) {
          val = this.__input.charAt(index);
        }
        return val;
      };
      InputScanner.prototype.__match = function(pattern, index) {
        pattern.lastIndex = index;
        var pattern_match = pattern.exec(this.__input);
        if (pattern_match && !(regexp_has_sticky && pattern.sticky)) {
          if (pattern_match.index !== index) {
            pattern_match = null;
          }
        }
        return pattern_match;
      };
      InputScanner.prototype.test = function(pattern, index) {
        index = index || 0;
        index += this.__position;
        if (index >= 0 && index < this.__input_length) {
          return !!this.__match(pattern, index);
        } else {
          return false;
        }
      };
      InputScanner.prototype.testChar = function(pattern, index) {
        var val = this.peek(index);
        pattern.lastIndex = 0;
        return val !== null && pattern.test(val);
      };
      InputScanner.prototype.match = function(pattern) {
        var pattern_match = this.__match(pattern, this.__position);
        if (pattern_match) {
          this.__position += pattern_match[0].length;
        } else {
          pattern_match = null;
        }
        return pattern_match;
      };
      InputScanner.prototype.read = function(starting_pattern, until_pattern, until_after) {
        var val = "";
        var match;
        if (starting_pattern) {
          match = this.match(starting_pattern);
          if (match) {
            val += match[0];
          }
        }
        if (until_pattern && (match || !starting_pattern)) {
          val += this.readUntil(until_pattern, until_after);
        }
        return val;
      };
      InputScanner.prototype.readUntil = function(pattern, until_after) {
        var val = "";
        var match_index = this.__position;
        pattern.lastIndex = this.__position;
        var pattern_match = pattern.exec(this.__input);
        if (pattern_match) {
          match_index = pattern_match.index;
          if (until_after) {
            match_index += pattern_match[0].length;
          }
        } else {
          match_index = this.__input_length;
        }
        val = this.__input.substring(this.__position, match_index);
        this.__position = match_index;
        return val;
      };
      InputScanner.prototype.readUntilAfter = function(pattern) {
        return this.readUntil(pattern, true);
      };
      InputScanner.prototype.get_regexp = function(pattern, match_from) {
        var result = null;
        var flags = "g";
        if (match_from && regexp_has_sticky) {
          flags = "y";
        }
        if (typeof pattern === "string" && pattern !== "") {
          result = new RegExp(pattern, flags);
        } else if (pattern) {
          result = new RegExp(pattern.source, flags);
        }
        return result;
      };
      InputScanner.prototype.get_literal_regexp = function(literal_string) {
        return RegExp(literal_string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
      };
      InputScanner.prototype.peekUntilAfter = function(pattern) {
        var start = this.__position;
        var val = this.readUntilAfter(pattern);
        this.__position = start;
        return val;
      };
      InputScanner.prototype.lookBack = function(testVal) {
        var start = this.__position - 1;
        return start >= testVal.length && this.__input.substring(start - testVal.length, start).toLowerCase() === testVal;
      };
      module.exports.InputScanner = InputScanner;
    },

}
