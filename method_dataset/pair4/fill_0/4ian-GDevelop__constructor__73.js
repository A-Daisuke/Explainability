class __C__ {
    constructor(
      runtimeObject: gdjs.Cube3DRuntimeObject,
      instanceContainer: gdjs.RuntimeInstanceContainer
    ) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);

      const materials: THREE.Material[] = new Array(6)
        .fill(0)
        .map((_, index) =>
          getFaceMaterial(runtimeObject, materialIndexToFaceIndex[index])
        );
      const boxMesh = new THREE.Mesh(geometry, materials);

      super(runtimeObject, instanceContainer, boxMesh);
      this._boxMesh = boxMesh;
      this._cube3DRuntimeObject = runtimeObject;

      boxMesh.receiveShadow = this._cube3DRuntimeObject._isReceivingShadow;
      boxMesh.castShadow = this._cube3DRuntimeObject._isCastingShadow;
      this.updateSize();
      this.updatePosition();
      this.updateRotation();
      this.updateTint();
    }

}
