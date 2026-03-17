    function peek_next_token_start_or_newline() {
        var pos = S.pos;
        for (var in_multiline_comment = false; pos < S.text.length; ) {
            var ch = get_full_char(S.text, pos);
            if (NEWLINE_CHARS.has(ch)) {
                return { char: ch, pos: pos };
            } else if (in_multiline_comment) {
                if (ch == "*" && get_full_char(S.text, pos + 1) == "/") {
                    pos += 2;
                    in_multiline_comment = false;
                } else {
                    pos++;
                }
            } else if (!WHITESPACE_CHARS.has(ch)) {
                if (ch == "/") {
                    var next_ch = get_full_char(S.text, pos + 1);
                    if (next_ch == "/") {
                        pos = find_eol();
                        return { char: get_full_char(S.text, pos), pos: pos };
                    } else if (next_ch == "*") {
                        in_multiline_comment = true;
                        pos += 2;
                        continue;
                    }
                }
                return { char: ch, pos: pos };
            } else {
                pos++;
            }
        }
        return { char: null, pos: pos };
    }
