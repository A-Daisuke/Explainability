class __C__ {
    post_process_semantic_segmentation(outputs, target_sizes = null) {

        const logits = outputs.logits;
        const batch_size = logits.dims[0];

        if (target_sizes !== null && target_sizes.length !== batch_size) {
            throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits")
        }

        const toReturn = [];
        for (let i = 0; i < batch_size; ++i) {
            const target_size = target_sizes !== null ? target_sizes[i] : null;

            let data = logits[i];

            // 1. If target_size is not null, we need to resize the masks to the target size
            if (target_size !== null) {
                // resize the masks to the target size
                data = (0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.interpolate)(data, target_size, 'bilinear', false);
            }
            const [height, width] = target_size ?? data.dims.slice(-2);

            const segmentation = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor(
                'int32',
                new Int32Array(height * width),
                [height, width]
            );

            // Buffer to store current largest value
            const buffer = data[0].data;
            for (let j = 1; j < data.dims[0]; ++j) {
                const row = data[j].data;
                for (let k = 0; k < row.length; ++k) {
                    if (row[k] > buffer[k]) {
                        buffer[k] = row[k];
                        segmentation.data[k] = j;
                    }
                }
            }

            // Store which objects have labels
            // This is much more efficient that creating a set of the final values
            const hasLabel = new Array(data.dims[0]);
            const out = segmentation.data;
            for (let j = 0; j < out.length; ++j) {
                const index = out[j];
                hasLabel[index] = index;
            }
            /** @type {number[]} The unique list of labels that were detected */
            const labels = hasLabel.filter(x => x !== undefined);

            toReturn.push({ segmentation, labels });
        }
        return toReturn;
    }

}
