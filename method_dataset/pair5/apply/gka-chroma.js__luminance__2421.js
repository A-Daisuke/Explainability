function __method_wrapper__() {
    Color.prototype.luminance = function (lum, mode) {
        if ( mode === void 0 ) mode = 'rgb';

        if (lum !== undefined && type(lum) === 'number') {
            if (lum === 0) {
                // return pure black
                return new Color([0, 0, 0, this._rgb[3]], 'rgb');
            }
            if (lum === 1) {
                // return pure white
                return new Color([255, 255, 255, this._rgb[3]], 'rgb');
            }
            // compute new color using...
            var cur_lum = this.luminance();
            var max_iter = MAX_ITER;

            var test = function (low, high) {
                var mid = low.interpolate(high, 0.5, mode);
                var lm = mid.luminance();
                if (Math.abs(lum - lm) < EPS || !max_iter--) {
                    // close enough
                    return mid;
                }
                return lm > lum ? test(low, mid) : test(mid, high);
            };

            var rgb = (
                cur_lum > lum
                    ? test(new Color([0, 0, 0]), this)
                    : test(this, new Color([255, 255, 255]))
            ).rgb();
            return new Color(rgb.concat( [this._rgb[3]]));
        }
        return rgb2luminance.apply(void 0, this._rgb.slice(0, 3));
    };

}
