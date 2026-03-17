class __C__ {
    async forward(model_inputs) {
        if (!model_inputs.image_embeddings || !model_inputs.image_positional_embeddings) {
            // Compute the image embeddings if they are missing
            model_inputs = {
                ...model_inputs,
                ...(await this.get_image_embeddings(model_inputs))
            }
        }

        if (!model_inputs.input_labels) {
            // Set default input labels if they are missing
            const shape = model_inputs.input_points.dims.slice(0, -1);
            const numElements = shape.reduce((a, b) => a * b, 1);
            model_inputs.input_labels = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.Tensor(
                'int64',
                new BigInt64Array(numElements).fill(1n),
                shape
            );
        }

        // Returns:
        //  - iou_scores: tensor.float32[batch_size,point_batch_size,3]
        //  - pred_masks: tensor.float32[batch_size,point_batch_size,3,256,256]
        return await sessionRun(this.prompt_encoder_mask_decoder, {
            input_points: model_inputs.input_points,
            input_labels: model_inputs.input_labels,
            image_embeddings: model_inputs.image_embeddings,
            image_positional_embeddings: model_inputs.image_positional_embeddings,
        });
    }

}
