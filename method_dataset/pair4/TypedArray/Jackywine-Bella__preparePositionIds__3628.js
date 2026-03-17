function preparePositionIds(session, feeds, use_cache_branch) {
    if (!session.inputNames.includes('position_ids')) return;

    const data = new BigInt64Array(feeds.attention_mask.data.length);

    // Compute cumulative sum of the attention mask along the sequence length dimension
    for (let i = 0; i < feeds.attention_mask.dims[0]; ++i) {
        let start = i * feeds.attention_mask.dims[1];
        let sum = BigInt(0);
        for (let j = 0; j < feeds.attention_mask.dims[1]; ++j) {
            const index = start + j;
            if (feeds.attention_mask.data[index] === 0n) {
                data[index] = BigInt(1);
            } else { // === 1n
                data[index] = sum;
                sum += feeds.attention_mask.data[index];
            }
        }
    }

    feeds.position_ids = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_4__.Tensor('int64', data, feeds.attention_mask.dims);

    if (use_cache_branch) {
        feeds.position_ids = feeds.position_ids.slice(null, -1).unsqueeze_(-1);
    }
}
