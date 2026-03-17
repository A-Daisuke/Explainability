    function contrastAPCA (text, bg) {
        // parse input colors
        text = new Color(text);
        bg = new Color(bg);
        // if text color has alpha, blend against background
        if (text.alpha() < 1) {
            text = mix(bg, text, text.alpha(), 'rgb');
        }
        var l_text = lum.apply(void 0, text.rgb());
        var l_bg = lum.apply(void 0, bg.rgb());

        // soft clamp black levels
        var Y_text =
            l_text >= B_threshold
                ? l_text
                : l_text + Math.pow(B_threshold - l_text, B_exp);
        var Y_bg =
            l_bg >= B_threshold ? l_bg : l_bg + Math.pow(B_threshold - l_bg, B_exp);

        // normal polarity (dark text on light background)
        var S_norm = Math.pow(Y_bg, 0.56) - Math.pow(Y_text, 0.57);
        // reverse polarity (light text on dark background)
        var S_rev = Math.pow(Y_bg, 0.65) - Math.pow(Y_text, 0.62);
        // clamp noise then scale
        var C =
            Math.abs(Y_bg - Y_text) < P_in
                ? 0
                : Y_text < Y_bg
                  ? S_norm * R_scale
                  : S_rev * R_scale;
        // clamp minimum contrast then offset
        var S_apc = Math.abs(C) < P_out ? 0 : C > 0 ? C - W_offset : C + W_offset;
        // scale to 100
        return S_apc * 100;
    }
