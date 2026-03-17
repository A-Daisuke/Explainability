class __C__ {
    async _call(audio, {
        padding = true,
        pad_to_multiple_of = 2,
        do_normalize_per_mel_bins = true,
        return_attention_mask = true,
    } = {}) {
        validate_audio_inputs(audio, 'SeamlessM4TFeatureExtractor');

        let features = this._extract_fbank_features(audio, this.config.max_length);

        if (do_normalize_per_mel_bins) {
            const [num_features, feature_size] = features.dims;
            for (let i = 0; i < feature_size; ++i) {
                let sum = 0;
                for (let j = 0; j < num_features; ++j) {
                    sum += features.data[j * feature_size + i];
                }

                const mean = sum / num_features;

                let variance = 0;
                for (let j = 0; j < num_features; ++j) {
                    variance += (features.data[j * feature_size + i] - mean) ** 2;
                }
                variance /= num_features - 1; // NOTE: We use ddof=1

                const std = Math.sqrt(variance + 1e-7);
                for (let j = 0; j < num_features; ++j) {
                    const index = j * feature_size + i;
                    features.data[index] = (features.data[index] - mean) / std;
                }
            }
        }

        let padded_attention_mask;
        if (padding) {
            const [num_frames, num_channels] = features.dims;

            const pad_size = num_frames % pad_to_multiple_of;
            if (pad_size > 0) {
                const padded_data = new Float32Array(num_channels * (num_frames + pad_size));
                padded_data.set(features.data)
                padded_data.fill(this.config.padding_value, features.data.length)

                const numPaddedFrames = num_frames + pad_size;
                features = {
                    data: padded_data,
                    dims: [numPaddedFrames, num_channels],
                }

                if (return_attention_mask) {
                    padded_attention_mask = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor(
                        'int64',
                        new BigInt64Array(numPaddedFrames),
                        [1, numPaddedFrames],
                    )
                    padded_attention_mask.data.fill(1n, 0, num_frames);
                }
            }
        }

        const [num_frames, num_channels] = features.dims;

        const stride = this.config.stride;
        const remainder = num_frames % stride;
        if (remainder !== 0) {
            throw new Error(`The number of frames (${num_frames}) must be a multiple of the stride (${stride}).`)
        }

        const input_features = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor('float32',
            features.data,
            features.dims,
        ).view(
            1,
            Math.floor(num_frames / stride),
            num_channels * stride,
        );

        const result = { input_features }

        if (return_attention_mask) {
            const reshapedNumFrames = input_features.dims[1];

            const attention_mask = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor(
                'int64',
                new BigInt64Array(reshapedNumFrames),
                [1, reshapedNumFrames],
            );
            if (padded_attention_mask) {
                for (let i = 1, j = 0; i < num_frames; i += stride, ++j) {
                    attention_mask.data[j] = padded_attention_mask.data[i];
                }
            } else {
                attention_mask.data.fill(1n);
            }

            result.attention_mask = attention_mask;
        }

        return result;
    }

}
