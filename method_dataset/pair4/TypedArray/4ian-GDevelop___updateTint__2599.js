class __C__ {
      _updateTint() {
        const tints = [];
        const normalizedTint = objectsRenderingService
          .hexNumberToRGBArray(
            objectsRenderingService.rgbOrHexToHexNumber(this._tint)
          )
          .map((component) => component / 255);

        for (
          let i = 0;
          i < this._threeObject.geometry.attributes.position.count;
          i++
        ) {
          tints.push(...normalizedTint);
        }

        this._threeObject.geometry.setAttribute(
          'color',
          new THREE.BufferAttribute(new Float32Array(tints), 3)
        );
      }

}
