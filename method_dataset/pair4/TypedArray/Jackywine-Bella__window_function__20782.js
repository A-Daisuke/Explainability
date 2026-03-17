function window_function(window_length, name, {
    periodic = true,
    frame_length = null,
    center = true,
} = {}) {
    const length = periodic ? window_length + 1 : window_length;
    let window;
    switch (name) {
        case 'boxcar':
            window = new Float64Array(length).fill(1.0);
            break;
        case 'hann':
        case 'hann_window':
            window = hanning(length);
            break;
        case 'povey':
            window = hanning(length).map(x => Math.pow(x, 0.85));
            break;
        default:
            throw new Error(`Unknown window type ${name}.`);
    }
    if (periodic) {
        window = window.subarray(0, window_length);
    }
    if (frame_length === null) {
        return window;
    }
    if (window_length > frame_length) {
        throw new Error(`Length of the window (${window_length}) may not be larger than frame_length (${frame_length})`);
    }

    return window;
}
