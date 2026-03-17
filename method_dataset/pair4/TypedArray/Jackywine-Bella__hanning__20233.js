function hanning(M) {
    if (M < 1) {
        return new Float64Array();
    }
    if (M === 1) {
        return new Float64Array([1]);
    }
    const denom = M - 1;
    const factor = Math.PI / denom;
    const cos_vals = new Float64Array(M);
    for (let i = 0; i < M; ++i) {
        const n = 2 * i - denom;
        cos_vals[i] = 0.5 + 0.5 * Math.cos(factor * n);
    }
    return cos_vals;
}
