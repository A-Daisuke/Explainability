function __method_wrapper__() {
    toTensor(channel_format = 'CHW') {
        let tensor = new _tensor_js__WEBPACK_IMPORTED_MODULE_2__.Tensor(
            'uint8',
            new Uint8Array(this.data),
            [this.height, this.width, this.channels]
        );

        if (channel_format === 'HWC') {
            // Do nothing
        } else if (channel_format === 'CHW') { // hwc -> chw
            tensor = tensor.permute(2, 0, 1);
        } else {
            throw new Error(`Unsupported channel format: ${channel_format}`);
        }
        return tensor;
    }

}
