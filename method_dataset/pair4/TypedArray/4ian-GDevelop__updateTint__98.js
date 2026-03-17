function __method_wrapper__() {
    updateTint() {
      const tints: number[] = [];

      const normalizedTint = gdjs
        .rgbOrHexToRGBColor(this._cube3DRuntimeObject.getColor())
        .map((component) => component / 255);

      for (
        let i = 0;
        i < this._boxMesh.geometry.attributes.position.count;
        i++
      ) {
        tints.push(...normalizedTint);
      }

      this._boxMesh.geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(new Float32Array(tints), 3)
      );
    }

}
