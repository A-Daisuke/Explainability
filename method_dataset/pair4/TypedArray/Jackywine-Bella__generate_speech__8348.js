class __C__ {
    async generate_speech(input_values, speaker_embeddings, {
        threshold = 0.5,
        minlenratio = 0.0,
        maxlenratio = 20.0,
        vocoder = null,
        // output_cross_attentions = false, // TODO add
    } = {}) {

        const model_inputs = {
            input_ids: input_values
        }

        const { encoder_outputs, encoder_attention_mask } = await encoderForward(this, model_inputs);

        const r = encoder_outputs.dims[1] / this.config.reduction_factor;
        const maxlen = Math.floor(r * maxlenratio);
        const minlen = Math.floor(r * minlenratio);

        const num_mel_bins = this.config.num_mel_bins;

        let spectrogramParts = [];
        let past_key_values = null;
        let decoder_outputs = null;
        let idx = 0;

        while (true) {
            ++idx;

            const use_cache_branch = boolTensor(!!decoder_outputs);
            let output_sequence;
            if (decoder_outputs) {
                output_sequence = decoder_outputs.output_sequence_out;
            } else {
                output_sequence = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.Tensor(
                    'float32',
                    new Float32Array(num_mel_bins),
                    [1, 1, num_mel_bins],
                )
            }
            let decoderFeeds = {
                use_cache_branch,
                output_sequence,
                encoder_attention_mask: encoder_attention_mask,
                speaker_embeddings: speaker_embeddings,
                encoder_hidden_states: encoder_outputs,
            };

            this.addPastKeyValues(decoderFeeds, past_key_values);
            decoder_outputs = await sessionRun(this.decoder_merged_session, decoderFeeds);
            past_key_values = this.getPastKeyValues(decoder_outputs, past_key_values);

            const { prob, spectrum } = decoder_outputs;
            spectrogramParts.push(spectrum);

            if (idx >= minlen && (
                // Finished when stop token or maximum length is reached.
                Array.from(prob.data).filter(p => p >= threshold).length > 0 || idx >= maxlen
            )) {
                break;
            }
        }

        const spectrogram = (0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.cat)(spectrogramParts);
        const { waveform } = await sessionRun(vocoder.session, { spectrogram });

        return {
            spectrogram,
            waveform,
            // cross_attentions: null, // TODO add
        }
    }

}
