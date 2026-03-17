class __C__ {
    _extract_token_timestamps(generate_outputs, alignment_heads, num_frames = null, time_precision = 0.02) {
        if (!generate_outputs.cross_attentions) {
            throw new Error(
                "Model outputs must contain cross attentions to extract timestamps. " +
                "This is most likely because the model was not exported with `output_attentions=True`."
            )
        }

        let median_filter_width = this.config.median_filter_width;
        if (median_filter_width === undefined) {
            console.warn("Model config has no `median_filter_width`, using default value of 7.")
            median_filter_width = 7;
        }

        const batchedMatrices = generate_outputs.cross_attentions.map(batch => {
            // Create a list with `decoder_layers` elements, each a tensor of shape
            // (batch size, attention_heads, output length, input length).
            let cross_attentions = Array.from({ length: this.config.decoder_layers },
                (_, i) => (0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.cat)(batch.map(x => x[i]), 2)
            );

            let weights = (0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.stack)(alignment_heads.map(([l, h]) => {
                return num_frames
                    ? cross_attentions[l].slice(null, h, null, [0, num_frames])
                    : cross_attentions[l].slice(null, h);
            }));
            weights = weights.transpose(1, 0, 2, 3)

            let [std, calculatedMean] = (0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.std_mean)(weights, -2, 0, true);

            // Normalize and smoothen the weights.
            let smoothedWeights = weights.clone(); // [1, 8, seqLength, 1500]

            for (let a = 0; a < smoothedWeights.dims[0]; ++a) {
                let aTensor = smoothedWeights[a]; // [8, seqLength, 1500]

                for (let b = 0; b < aTensor.dims[0]; ++b) {
                    let bTensor = aTensor[b]; // [seqLength, 1500]

                    const stdTensor = std[a][b][0]; // [1500]
                    const meanTensor = calculatedMean[a][b][0]; // [1500]

                    for (let c = 0; c < bTensor.dims[0]; ++c) {

                        let cTensor = bTensor[c]; // [1500]
                        for (let d = 0; d < cTensor.data.length; ++d) {
                            cTensor.data[d] = (cTensor.data[d] - meanTensor.data[d]) / stdTensor.data[d]
                        }

                        // Apply median filter.
                        cTensor.data.set((0,_transformers_js__WEBPACK_IMPORTED_MODULE_6__.medianFilter)(cTensor.data, median_filter_width))
                    }
                }
            }

            // Average the different cross-attention heads.
            const matrix = (0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.mean)(smoothedWeights, 1);
            return matrix;
        });

        const timestampsShape = [generate_outputs.sequences.length, generate_outputs.sequences[0].length];

        const timestamps = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.Tensor(
            'float32',
            new Float32Array(timestampsShape[0] * timestampsShape[1]),
            timestampsShape
        );

        // Perform dynamic time warping on each element of the batch.
        for (let batch_idx = 0; batch_idx < timestampsShape[0]; ++batch_idx) {
            // NOTE: Since we run only one batch at a time, we can squeeze to get the same dimensions
            // as the python implementation
            const matrix = batchedMatrices[batch_idx].neg().squeeze_(0);
            let [text_indices, time_indices] = (0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.dynamicTimeWarping)(matrix);

            let diffs = Array.from({ length: text_indices.length - 1 }, (v, i) => text_indices[i + 1] - text_indices[i]);
            let jumps = (0,_utils_core_js__WEBPACK_IMPORTED_MODULE_1__.mergeArrays)([1], diffs).map(x => !!x); // convert to boolean

            let jump_times = [];
            for (let i = 0; i < jumps.length; ++i) {
                if (jumps[i]) {
                    jump_times.push(time_indices[i] * time_precision);
                    // NOTE: No point in rounding here, since we set to Float32Array later
                }
            }
            timestamps[batch_idx].data.set(jump_times, 1)
        }

        return timestamps;
    }

}
