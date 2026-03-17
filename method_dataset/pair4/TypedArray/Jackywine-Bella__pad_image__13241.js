class __C__ {
    pad_image(pixelData, imgDims, padSize, {
        mode = 'constant',
        center = false,
        constant_values = 0,
    } = {}) {
        const [imageHeight, imageWidth, imageChannels] = imgDims;

        let paddedImageWidth, paddedImageHeight;
        if (typeof padSize === 'number') {
            paddedImageWidth = padSize;
            paddedImageHeight = padSize;
        } else {
            paddedImageWidth = padSize.width;
            paddedImageHeight = padSize.height;
        }

        // Only add padding if there is a difference in size
        if (paddedImageWidth !== imageWidth || paddedImageHeight !== imageHeight) {
            const paddedPixelData = new Float32Array(paddedImageWidth * paddedImageHeight * imageChannels);
            if (Array.isArray(constant_values)) {
                // Fill with constant values, cycling through the array
                for (let i = 0; i < paddedPixelData.length; ++i) {
                    paddedPixelData[i] = constant_values[i % imageChannels];
                }
            } else if (constant_values !== 0) {
                paddedPixelData.fill(constant_values);
            }

            const [left, top] = center
                ? [Math.floor((paddedImageWidth - imageWidth) / 2), Math.floor((paddedImageHeight - imageHeight) / 2)]
                : [0, 0];

            // Copy the original image into the padded image
            for (let i = 0; i < imageHeight; ++i) {
                const a = (i + top) * paddedImageWidth;
                const b = i * imageWidth;
                for (let j = 0; j < imageWidth; ++j) {
                    const c = (a + j + left) * imageChannels;
                    const d = (b + j) * imageChannels;
                    for (let k = 0; k < imageChannels; ++k) {
                        paddedPixelData[c + k] = pixelData[d + k];
                    }
                }
            }

            if (mode === 'symmetric') {
                if (center) {
                    throw new Error('`center` padding is not supported when `mode` is set to `symmetric`.');
                    // TODO: Implement this
                }
                const h1 = imageHeight - 1;
                const w1 = imageWidth - 1;
                for (let i = 0; i < paddedImageHeight; ++i) {
                    const a = i * paddedImageWidth;
                    const b = (0,_utils_core_js__WEBPACK_IMPORTED_MODULE_0__.calculateReflectOffset)(i, h1) * imageWidth;

                    for (let j = 0; j < paddedImageWidth; ++j) {
                        if (i < imageHeight && j < imageWidth) continue; // Do not overwrite original image
                        const c = (a + j) * imageChannels;
                        const d = (b + (0,_utils_core_js__WEBPACK_IMPORTED_MODULE_0__.calculateReflectOffset)(j, w1)) * imageChannels;

                        // Copy channel-wise
                        for (let k = 0; k < imageChannels; ++k) {
                            paddedPixelData[c + k] = pixelData[d + k];
                        }
                    }
                }
            }


            // Update pixel data and image dimensions
            pixelData = paddedPixelData;
            imgDims = [paddedImageHeight, paddedImageWidth, imageChannels]
        }
        return [pixelData, imgDims];
    }

}
