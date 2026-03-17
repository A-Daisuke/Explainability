function __method_wrapper__() {
    async _call(audio) {
        validate_audio_inputs(audio, 'Wav2Vec2FeatureExtractor');

        if (audio instanceof Float64Array) {
            audio = new Float32Array(audio);
        }

        let input_values = audio;

        // zero-mean and unit-variance normalization
        if (this.config.do_normalize) {
            input_values = this._zero_mean_unit_var_norm(input_values);
        }

        // TODO: allow user to pass in attention mask
        const shape = [1, input_values.length];
        return {
            input_values: new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor('float32', input_values, shape),
            attention_mask: new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor('int64', new BigInt64Array(input_values.length).fill(1n), shape)
        };
    }

}
