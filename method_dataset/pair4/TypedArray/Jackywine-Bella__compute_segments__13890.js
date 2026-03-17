class __C__ {
    compute_segments(
        mask_probs,
        pred_scores,
        pred_labels,
        mask_threshold,
        overlap_mask_area_threshold,
        label_ids_to_fuse = null,
        target_size = null,
    ) {
        let [height, width] = target_size ?? mask_probs[0].dims;

        let segmentation = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor(
            'int32',
            new Int32Array(height * width),
            [height, width]
        );
        let segments = [];

        // 1. If target_size is not null, we need to resize the masks to the target size
        if (target_size !== null) {
            // resize the masks to the target size
            for (let i = 0; i < mask_probs.length; ++i) {
                mask_probs[i] = (0,_utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.interpolate)(mask_probs[i], target_size, 'bilinear', false);
            }
        }

        // 2. Weigh each mask by its prediction score
        // NOTE: `mask_probs` is updated in-place
        // 
        // Temporary storage for the best label/scores for each pixel ([height, width]):
        let mask_labels = new Int32Array(mask_probs[0].data.length);
        let bestScores = new Float32Array(mask_probs[0].data.length);

        for (let i = 0; i < mask_probs.length; ++i) {
            let score = pred_scores[i];

            for (let j = 0; j < mask_probs[i].data.length; ++j) {
                mask_probs[i].data[j] *= score
                if (mask_probs[i].data[j] > bestScores[j]) {
                    mask_labels[j] = i;
                    bestScores[j] = mask_probs[i].data[j];
                }
            }
        }

        let current_segment_id = 0;

        // let stuff_memory_list = {}
        for (let k = 0; k < pred_labels.length; ++k) {
            let pred_class = pred_labels[k];

            // TODO add `should_fuse`
            // let should_fuse = pred_class in label_ids_to_fuse

            // Check if mask exists and large enough to be a segment
            let [mask_exists, mask_k] = this.check_segment_validity(
                mask_labels,
                mask_probs,
                k,
                mask_threshold,
                overlap_mask_area_threshold
            )

            if (!mask_exists) {
                // Nothing to see here
                continue;
            }

            // TODO
            // if (pred_class in stuff_memory_list) {
            //     current_segment_id = stuff_memory_list[pred_class]
            // } else {
            //     current_segment_id += 1;
            // }
            ++current_segment_id;


            // Add current object segment to final segmentation map
            for (let index of mask_k) {
                segmentation.data[index] = current_segment_id;
            }

            segments.push({
                id: current_segment_id,
                label_id: pred_class,
                // was_fused: should_fuse, TODO
                score: pred_scores[k],
            })

            // TODO
            // if(should_fuse){
            //     stuff_memory_list[pred_class] = current_segment_id
            // }
        }

        return [segmentation, segments];
    }

}
