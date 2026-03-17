function __method_wrapper__() {
    constructor(fft_length) {
        // Helper variables
        const a = 2 * (fft_length - 1);
        const b = 2 * (2 * fft_length - 1);
        const nextP2 = 2 ** (Math.ceil(Math.log2(b)))
        this.bufferSize = nextP2;
        this._a = a;

        // Define buffers
        // Compute chirp for transform
        const chirp = new Float64Array(b);
        const ichirp = new Float64Array(nextP2);
        this._chirpBuffer = new Float64Array(nextP2);
        this._buffer1 = new Float64Array(nextP2);
        this._buffer2 = new Float64Array(nextP2);
        this._outBuffer1 = new Float64Array(nextP2);
        this._outBuffer2 = new Float64Array(nextP2);

        // Compute complex exponentiation
        const theta = -2 * Math.PI / fft_length;
        const baseR = Math.cos(theta);
        const baseI = Math.sin(theta);

        // Precompute helper for chirp-z transform
        for (let i = 0; i < b >> 1; ++i) {
            // Compute complex power:
            const e = (i + 1 - fft_length) ** 2 / 2.0;

            // Compute the modulus and argument of the result
            const result_mod = Math.sqrt(baseR ** 2 + baseI ** 2) ** e;
            const result_arg = e * Math.atan2(baseI, baseR);

            // Convert the result back to rectangular form
            // and assign to chirp and ichirp
            const i2 = 2 * i;
            chirp[i2] = result_mod * Math.cos(result_arg);
            chirp[i2 + 1] = result_mod * Math.sin(result_arg);

            // conjugate
            ichirp[i2] = chirp[i2];
            ichirp[i2 + 1] = - chirp[i2 + 1];
        }
        this._slicedChirpBuffer = chirp.subarray(a, b);

        // create object to perform Fast Fourier Transforms
        // with `nextP2` complex numbers
        this._f = new P2FFT(nextP2 >> 1);
        this._f.transform(this._chirpBuffer, ichirp);
    }

}
