function __method_wrapper__() {
    post_process_masks(masks, original_sizes, reshaped_input_sizes, {
        mask_threshold = 0.0,
        binarize = true,
        pad_size = null,
    } = {}) {
        // masks: [1, 1, 3, 256, 256]

        const output_masks = [];

        pad_size = pad_size ?? this.pad_size;

        const target_image_size = [pad_size.height, pad_size.width];

        for (let i = 0; i < original_sizes.length; ++i) {
            const original_size = original_sizes[i];
            const reshaped_input_size = reshaped_input_sizes[i];

            const mask = masks[i]; // [b, c, h, w]

            // TODO: improve
            const interpolated_masks = [];
            for (let j = 0; j < mask.dims[0]; ++j) {
                const m = mask[j]; // 3d tensor

                // Upscale mask to padded size
                let interpolated_mask = (0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.interpolate)(m, target_image_size, 'bilinear', false);

                // Crop mask
                interpolated_mask = interpolated_mask.slice(null, [0, reshaped_input_size[0]], [0, reshaped_input_size[1]]);

                // Downscale mask
                interpolated_mask = (0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.interpolate)(interpolated_mask, original_size, 'bilinear', false);

                if (binarize) {
                    const binarizedMaskData = new Uint8Array(interpolated_mask.data.length);
                    for (let i = 0; i < interpolated_mask.data.length; ++i) {
                        if (interpolated_mask.data[i] > mask_threshold) {
                            binarizedMaskData[i] = 1;
                        }
                    }
                    interpolated_mask = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor(
                        'bool',
                        binarizedMaskData,
                        interpolated_mask.dims
                    )
                }

                interpolated_masks.push(interpolated_mask);
            }

            output_masks.push((0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.stack)(interpolated_masks));
        }

        return output_masks;
    }

}
