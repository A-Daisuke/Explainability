function __method_wrapper__() {
    async _call(audio) {
        validate_audio_inputs(audio, 'WhisperFeatureExtractor');

        let waveform;
        if (audio.length > this.config.n_samples) {
            console.warn(
                "Attempting to extract features for audio longer than 30 seconds. " +
                "If using a pipeline to extract transcript from a long audio clip, " +
                "remember to specify `chunk_length_s` and/or `stride_length_s`."
            );
            waveform = audio.slice(0, this.config.n_samples);
        } else {
            // pad with zeros
            waveform = new Float32Array(this.config.n_samples);
            waveform.set(audio);
        }

        const { data, dims } = this._extract_fbank_features(waveform);

        return {
            input_features: new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor('float32',
                data,
                [1, ...dims]
            )
        };
    }

}
