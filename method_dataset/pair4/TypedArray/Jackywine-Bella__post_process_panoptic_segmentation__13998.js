function __method_wrapper__() {
    post_process_panoptic_segmentation(
        outputs,
        threshold = 0.5,
        mask_threshold = 0.5,
        overlap_mask_area_threshold = 0.8,
        label_ids_to_fuse = null,
        target_sizes = null,
    ) {
        if (label_ids_to_fuse === null) {
            console.warn("`label_ids_to_fuse` unset. No instance will be fused.")
            label_ids_to_fuse = new Set();
        }

        const class_queries_logits = outputs.logits; // [batch_size, num_queries, num_classes+1]
        const masks_queries_logits = outputs.pred_masks; // [batch_size, num_queries, height, width]

        const mask_probs = masks_queries_logits.sigmoid()  // [batch_size, num_queries, height, width]

        let [batch_size, num_queries, num_labels] = class_queries_logits.dims;
        num_labels -= 1; // Remove last class (background)

        if (target_sizes !== null && target_sizes.length !== batch_size) {
            throw Error("Make sure that you pass in as many target sizes as the batch dimension of the logits")
        }

        let toReturn = [];
        for (let i = 0; i < batch_size; ++i) {
            let target_size = target_sizes !== null ? target_sizes[i] : null;

            let class_logits = class_queries_logits[i];
            let mask_logits = mask_probs[i];

            let [mask_probs_item, pred_scores_item, pred_labels_item] = this.remove_low_and_no_objects(class_logits, mask_logits, threshold, num_labels);

            if (pred_labels_item.length === 0) {
                // No mask found
                let [height, width] = target_size ?? mask_logits.dims.slice(-2);

                let segmentation = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor(
                    'int32',
                    new Int32Array(height * width).fill(-1),
                    [height, width]
                )
                toReturn.push({
                    segmentation: segmentation,
                    segments_info: []
                });
                continue;
            }


            // Get segmentation map and segment information of batch item
            let [segmentation, segments] = this.compute_segments(
                mask_probs_item,
                pred_scores_item,
                pred_labels_item,
                mask_threshold,
                overlap_mask_area_threshold,
                label_ids_to_fuse,
                target_size,
            )

            toReturn.push({
                segmentation: segmentation,
                segments_info: segments
            })
        }

        return toReturn;
    }

}
