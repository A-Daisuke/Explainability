async function decoderRunBeam(self, beam) {
    let attnMaskData = new BigInt64Array(beam.output_token_ids.length).fill(1n)

    // 1. Prepare
    let model_inputs = {
        input_ids: beam.model_input_ids,
        attention_mask: new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.Tensor(
            'int64',
            attnMaskData,
            [1, attnMaskData.length]
        ),
        past_key_values: beam.prev_model_outputs?.past_key_values,
    }

    // 2. Run
    let output = await self.forward(model_inputs);

    // 3. Update
    beam.prev_model_outputs = output;

    return output;
}
