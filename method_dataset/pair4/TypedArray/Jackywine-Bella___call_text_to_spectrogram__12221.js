function __method_wrapper__() {
    async _call_text_to_spectrogram(text_inputs, { speaker_embeddings }) {

        // Load vocoder, if not provided
        if (!this.vocoder) {
            console.log('No vocoder specified, using default HifiGan vocoder.');
            this.vocoder = await _models_js__WEBPACK_IMPORTED_MODULE_1__.AutoModel.from_pretrained(this.DEFAULT_VOCODER_ID, { quantized: false });
        }

        // Load speaker embeddings as Float32Array from path/URL
        if (typeof speaker_embeddings === 'string' || speaker_embeddings instanceof URL) {
            // Load from URL with fetch
            speaker_embeddings = new Float32Array(
                await (await fetch(speaker_embeddings)).arrayBuffer()
            );
        }

        if (speaker_embeddings instanceof Float32Array) {
            speaker_embeddings = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_6__.Tensor(
                'float32',
                speaker_embeddings,
                [1, speaker_embeddings.length]
            )
        } else if (!(speaker_embeddings instanceof _utils_tensor_js__WEBPACK_IMPORTED_MODULE_6__.Tensor)) {
            throw new Error("Speaker embeddings must be a `Tensor`, `Float32Array`, `string`, or `URL`.")
        }

        // Run tokenization
        const { input_ids } = this.tokenizer(text_inputs, {
            padding: true,
            truncation: true,
        });

        // NOTE: At this point, we are guaranteed that `speaker_embeddings` is a `Tensor`
        // @ts-ignore
        const { waveform } = await this.model.generate_speech(input_ids, speaker_embeddings, { vocoder: this.vocoder });

        const sampling_rate = this.processor.feature_extractor.config.sampling_rate;
        return {
            audio: waveform.data,
            sampling_rate,
        }
    }

}
