async function encoderForward(self, model_inputs) {
    const encoderFeeds = Object.create(null);
    for (const key of self.session.inputNames) {
        encoderFeeds[key] = model_inputs[key];
    }
    if (self.session.inputNames.includes('token_type_ids') && !encoderFeeds.token_type_ids) {
        // Assign default `token_type_ids` (all zeroes) to the `encoderFeeds` if the model expects it,
        // but they weren't created by the tokenizer.
        encoderFeeds.token_type_ids = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.Tensor(
            'int64',
            new BigInt64Array(encoderFeeds.input_ids.data.length),
            encoderFeeds.input_ids.dims
        )
    }
    return await sessionRun(self.session, encoderFeeds);
}
