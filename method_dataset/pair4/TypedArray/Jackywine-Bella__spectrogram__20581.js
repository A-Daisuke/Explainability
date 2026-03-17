function spectrogram(
    waveform,
    window,
    frame_length,
    hop_length,
    {
        fft_length = null,
        power = 1.0,
        center = true,
        pad_mode = "reflect",
        onesided = true,
        preemphasis = null,
        mel_filters = null,
        mel_floor = 1e-10,
        log_mel = null,
        reference = 1.0,
        min_value = 1e-10,
        db_range = null,
        remove_dc_offset = null,

        // Custom parameters for efficiency reasons
        max_num_frames = null,
        do_pad = true,
        transpose = false,
    } = {}
) {
    const window_length = window.length;
    if (fft_length === null) {
        fft_length = frame_length;
    }
    if (frame_length > fft_length) {
        throw Error(`frame_length (${frame_length}) may not be larger than fft_length (${fft_length})`)
    }

    if (window_length !== frame_length) {
        throw new Error(`Length of the window (${window_length}) must equal frame_length (${frame_length})`);
    }

    if (hop_length <= 0) {
        throw new Error("hop_length must be greater than zero");
    }

    if (center) {
        if (pad_mode !== 'reflect') {
            throw new Error(`pad_mode="${pad_mode}" not implemented yet.`)
        }
        const half_window = Math.floor((fft_length - 1) / 2) + 1;
        waveform = padReflect(waveform, half_window, half_window);
    }

    // split waveform into frames of frame_length size
    const num_frames = Math.floor(1 + Math.floor((waveform.length - frame_length) / hop_length))

    const num_frequency_bins = onesided ? Math.floor(fft_length / 2) + 1 : fft_length

    let d1 = num_frames;
    let d1Max = num_frames;

    // If maximum number of frames is provided, we must either pad or truncate
    if (max_num_frames !== null) {
        if (max_num_frames > num_frames) { // input is too short, so we pad
            if (do_pad) {
                d1Max = max_num_frames;
            }
        } else { // input is too long, so we truncate
            d1Max = d1 = max_num_frames;
        }
    }

    // Preallocate arrays to store output.
    const fft = new _maths_js__WEBPACK_IMPORTED_MODULE_1__.FFT(fft_length);
    const inputBuffer = new Float64Array(fft_length);
    const outputBuffer = new Float64Array(fft.outputBufferSize);
    const magnitudes = new Array(d1);

    for (let i = 0; i < d1; ++i) {
        // Populate buffer with waveform data
        const offset = i * hop_length;
        for (let j = 0; j < frame_length; ++j) {
            inputBuffer[j] = waveform[offset + j];
        }

        if (remove_dc_offset) {
            let sum = 0;
            for (let j = 0; j < frame_length; ++j) {
                sum += inputBuffer[j];
            }
            const mean = sum / frame_length;
            for (let j = 0; j < frame_length; ++j) {
                inputBuffer[j] -= mean;
            }
        }

        if (preemphasis !== null) {
            // Done in reverse to avoid copies and distructive modification
            for (let j = frame_length - 1; j >= 1; --j) {
                inputBuffer[j] -= preemphasis * inputBuffer[j - 1];
            }
            inputBuffer[0] *= 1 - preemphasis;
        }

        for (let j = 0; j < window.length; ++j) {
            inputBuffer[j] *= window[j];
        }

        fft.realTransform(outputBuffer, inputBuffer);

        // compute magnitudes
        const row = new Array(num_frequency_bins);
        for (let j = 0; j < row.length; ++j) {
            const j2 = j << 1;
            row[j] = outputBuffer[j2] ** 2 + outputBuffer[j2 + 1] ** 2;
        }
        magnitudes[i] = row;
    }

    // TODO what should happen if power is None?
    // https://github.com/huggingface/transformers/issues/27772
    if (power !== null && power !== 2) {
        // slight optimization to not sqrt
        const pow = 2 / power; // we use 2 since we already squared
        for (let i = 0; i < magnitudes.length; ++i) {
            const magnitude = magnitudes[i];
            for (let j = 0; j < magnitude.length; ++j) {
                magnitude[j] **= pow;
            }
        }
    }

    // TODO: What if `mel_filters` is null?
    const num_mel_filters = mel_filters.length;

    // Only here do we create Float32Array
    const mel_spec = new Float32Array(num_mel_filters * d1Max);

    // Perform matrix muliplication:
    // mel_spec = mel_filters @ magnitudes.T
    //  - mel_filters.shape=(80, 201)
    //  - magnitudes.shape=(3000, 201) => - magnitudes.T.shape=(201, 3000)
    //  - mel_spec.shape=(80, 3000)
    const dims = transpose ? [d1Max, num_mel_filters] : [num_mel_filters, d1Max];
    for (let i = 0; i < num_mel_filters; ++i) { // num melfilters (e.g., 80)
        const filter = mel_filters[i];
        for (let j = 0; j < d1; ++j) { // num frames (e.g., 3000)
            const magnitude = magnitudes[j];

            let sum = 0;
            for (let k = 0; k < num_frequency_bins; ++k) { // num frequency bins (e.g., 201)
                sum += filter[k] * magnitude[k];
            }

            mel_spec[
                transpose
                    ? j * num_mel_filters + i
                    : i * d1 + j
            ] = Math.max(mel_floor, sum);
        }
    }

    if (power !== null && log_mel !== null) {
        const o = Math.min(mel_spec.length, d1 * num_mel_filters);
        switch (log_mel) {
            case 'log':
                for (let i = 0; i < o; ++i) {
                    mel_spec[i] = Math.log(mel_spec[i]);
                }
                break;
            case 'log10':
                for (let i = 0; i < o; ++i) {
                    mel_spec[i] = Math.log10(mel_spec[i]);
                }
                break;
            case 'dB':
                if (power === 1.0) {
                    // NOTE: operates in-place
                    amplitude_to_db(mel_spec, reference, min_value, db_range);
                } else if (power === 2.0) {
                    power_to_db(mel_spec, reference, min_value, db_range);
                } else {
                    throw new Error(`Cannot use log_mel option '${log_mel}' with power ${power}`)
                }
                break;
            default:
                throw new Error(`log_mel must be one of null, 'log', 'log10' or 'dB'. Got '${log_mel}'`);
        }
    }

    return { data: mel_spec, dims };
}
