function __method_wrapper__() {
    _get_input_mel(waveform, max_length, truncation, padding) {

        /** @type {{ data: Float32Array; dims: number[]}} */
        let input_mel;
        let longer = false;
        const diff = waveform.length - max_length;
        if (diff > 0) {
            if (truncation === 'rand_trunc') {
                longer = true;
                const idx = Math.floor(Math.random() * (diff + 1));
                waveform = waveform.subarray(idx, idx + max_length);

                input_mel = this._extract_fbank_features(waveform, this.mel_filters_slaney, this.config.nb_max_samples);
                input_mel.dims = [1, ...input_mel.dims]; // "unsqueeze"
            } else {
                // TODO implement fusion strategy
                throw new Error(`Truncation strategy "${truncation}" not implemented`)
            }
        } else {
            if (diff < 0) {
                let padded = new Float64Array(max_length); // already padded with zeros
                padded.set(waveform);

                if (padding === 'repeat') {
                    for (let i = waveform.length; i < max_length; i += waveform.length) {
                        padded.set(waveform.subarray(0, Math.min(waveform.length, max_length - i)), i);
                    }
                } else if (padding === 'repeatpad') {
                    for (let i = waveform.length; i < -diff; i += waveform.length) {
                        padded.set(waveform, i);
                    }
                }
                waveform = padded;
            }

            if (truncation === 'fusion') {
                throw new Error(`Truncation strategy "${truncation}" not implemented`)
            }

            input_mel = this._extract_fbank_features(waveform, this.mel_filters_slaney, this.config.nb_max_samples);
            input_mel.dims = [1, ...input_mel.dims]; // "unsqueeze"
        }

        return {
            ...input_mel,
            longer,
        }
    }

}
