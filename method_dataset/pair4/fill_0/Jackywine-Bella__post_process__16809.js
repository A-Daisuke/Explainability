function __method_wrapper__() {
    post_process(tokens, tokens_pair = null, {
        add_special_tokens = true,
    } = {}) {
        if (add_special_tokens) {
            tokens = (0,_utils_core_js__WEBPACK_IMPORTED_MODULE_0__.mergeArrays)([this.cls], tokens, [this.sep]);
        }

        let token_type_ids = new Array(tokens.length).fill(0);
        if (tokens_pair !== null) {
            // NOTE: It is intended to add 2 EOS tokens after the first set of tokens
            // https://github.com/huggingface/tokenizers/issues/983
            const middle = (add_special_tokens && this instanceof RobertaProcessing)
                ? [this.sep]
                : [];
            const after = add_special_tokens ? [this.sep] : [];

            tokens = (0,_utils_core_js__WEBPACK_IMPORTED_MODULE_0__.mergeArrays)(tokens, middle, tokens_pair, after);
            token_type_ids = (0,_utils_core_js__WEBPACK_IMPORTED_MODULE_0__.mergeArrays)(token_type_ids, new Array(tokens_pair.length + middle.length + after.length).fill(1));
        }
        return { tokens, token_type_ids };
    }

}
