class __C__ {
    async _call(images) {
        const result = await super._call(images);

        // TODO support differently-sized images, for now assume all images are the same size.
        // TODO support different mask sizes (not just 64x64)
        // Currently, just fill pixel mask with 1s
        const maskSize = [result.pixel_values.dims[0], 64, 64];
        const pixel_mask = new _utils_tensor_js__WEBPACK_IMPORTED_MODULE_3__.Tensor(
            'int64',
            new BigInt64Array(maskSize.reduce((a, b) => a * b)).fill(1n),
            maskSize
        );

        return { ...result, pixel_mask };
    }

}
