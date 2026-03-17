class __C__ {
    async _call(images, {
        threshold = 0.5,
        mask_threshold = 0.5,
        overlap_mask_area_threshold = 0.8,
        label_ids_to_fuse = null,
        target_sizes = null,
        subtask = null,
    } = {}) {
        const isBatched = Array.isArray(images);

        if (isBatched && images.length !== 1) {
            throw Error("Image segmentation pipeline currently only supports a batch size of 1.");
        }

        const preparedImages = await prepareImages(images);
        const imageSizes = preparedImages.map(x => [x.height, x.width]);

        const { pixel_values, pixel_mask } = await this.processor(preparedImages);
        const output = await this.model({ pixel_values, pixel_mask });

        let fn = null;
        if (subtask !== null) {
            fn = this.subtasks_mapping[subtask];
        } else {
            for (let [task, func] of Object.entries(this.subtasks_mapping)) {
                if (func in this.processor.feature_extractor) {
                    fn = this.processor.feature_extractor[func].bind(this.processor.feature_extractor);
                    subtask = task;
                    break;
                }
            }
        }

        const id2label = this.model.config.id2label;

        /** @type {ImageSegmentationPipelineOutput[]} */
        const annotation = [];
        if (subtask === 'panoptic' || subtask === 'instance') {
            const processed = fn(
                output,
                threshold,
                mask_threshold,
                overlap_mask_area_threshold,
                label_ids_to_fuse,
                target_sizes ?? imageSizes, // TODO FIX?
            )[0];

            const segmentation = processed.segmentation;

            for (const segment of processed.segments_info) {
                const maskData = new Uint8ClampedArray(segmentation.data.length);
                for (let i = 0; i < segmentation.data.length; ++i) {
                    if (segmentation.data[i] === segment.id) {
                        maskData[i] = 255;
                    }
                }

                const mask = new _utils_image_js__WEBPACK_IMPORTED_MODULE_7__.RawImage(maskData, segmentation.dims[1], segmentation.dims[0], 1)

                annotation.push({
                    score: segment.score,
                    label: id2label[segment.label_id],
                    mask: mask
                })
            }

        } else if (subtask === 'semantic') {
            const { segmentation, labels } = fn(output, target_sizes ?? imageSizes)[0];

            for (const label of labels) {
                const maskData = new Uint8ClampedArray(segmentation.data.length);
                for (let i = 0; i < segmentation.data.length; ++i) {
                    if (segmentation.data[i] === label) {
                        maskData[i] = 255;
                    }
                }

                const mask = new _utils_image_js__WEBPACK_IMPORTED_MODULE_7__.RawImage(maskData, segmentation.dims[1], segmentation.dims[0], 1);

                annotation.push({
                    score: null,
                    label: id2label[label],
                    mask: mask
                });
            }
        } else {
            throw Error(`Subtask ${subtask} not supported.`);
        }

        return annotation;
    }

}
