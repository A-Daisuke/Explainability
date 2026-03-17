class __C__ {
    constructor(size) {
        this.size = size | 0; // convert to a 32-bit signed integer
        if (this.size <= 1 || !isPowerOfTwo(this.size))
            throw new Error('FFT size must be a power of two larger than 1');

        this._csize = size << 1;

        this.table = new Float64Array(this.size * 2);
        for (let i = 0; i < this.table.length; i += 2) {
            const angle = Math.PI * i / this.size;
            this.table[i] = Math.cos(angle);
            this.table[i + 1] = -Math.sin(angle);
        }

        // Find size's power of two
        let power = 0;
        for (let t = 1; this.size > t; t <<= 1)
            ++power;

        // Calculate initial step's width:
        //   * If we are full radix-4, it is 2x smaller to give inital len=8
        //   * Otherwise it is the same as `power` to give len=4
        this._width = power % 2 === 0 ? power - 1 : power;

        // Pre-compute bit-reversal patterns
        this._bitrev = new Int32Array(1 << this._width);
        for (let j = 0; j < this._bitrev.length; ++j) {
            this._bitrev[j] = 0;
            for (let shift = 0; shift < this._width; shift += 2) {
                const revShift = this._width - shift - 2;
                this._bitrev[j] |= ((j >>> shift) & 3) << revShift;
            }
        }
    }

}
