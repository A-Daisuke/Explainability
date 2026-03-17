      var Tokenizer = function(input_string, options) {
        BaseTokenizer.call(this, input_string, options);
        this._current_tag_name = "";
        var templatable_reader = new TemplatablePattern(this._input).read_options(this._options);
        var pattern_reader = new Pattern(this._input);
        this.__patterns = {
          word: templatable_reader.until(/[\n\r\t <]/),
          word_control_flow_close_excluded: templatable_reader.until(/[\n\r\t <}]/),
          single_quote: templatable_reader.until_after(/'/),
          double_quote: templatable_reader.until_after(/"/),
          attribute: templatable_reader.until(/[\n\r\t =>]|\/>/),
          element_name: templatable_reader.until(/[\n\r\t >\/]/),
          angular_control_flow_start: pattern_reader.matching(/\@[a-zA-Z]+[^({]*[({]/),
          handlebars_comment: pattern_reader.starting_with(/{{!--/).until_after(/--}}/),
          handlebars: pattern_reader.starting_with(/{{/).until_after(/}}/),
          handlebars_open: pattern_reader.until(/[\n\r\t }]/),
          handlebars_raw_close: pattern_reader.until(/}}/),
          comment: pattern_reader.starting_with(/<!--/).until_after(/-->/),
          cdata: pattern_reader.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
          // https://en.wikipedia.org/wiki/Conditional_comment
          conditional_comment: pattern_reader.starting_with(/<!\[/).until_after(/]>/),
          processing: pattern_reader.starting_with(/<\?/).until_after(/\?>/)
        };
        if (this._options.indent_handlebars) {
          this.__patterns.word = this.__patterns.word.exclude("handlebars");
          this.__patterns.word_control_flow_close_excluded = this.__patterns.word_control_flow_close_excluded.exclude("handlebars");
        }
        this._unformatted_content_delimiter = null;
        if (this._options.unformatted_content_delimiter) {
          var literal_regexp = this._input.get_literal_regexp(this._options.unformatted_content_delimiter);
          this.__patterns.unformatted_content_delimiter = pattern_reader.matching(literal_regexp).until_after(literal_regexp);
        }
      };
