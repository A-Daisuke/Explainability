class __C__ {
  constructor(
    project: gdProject,
    instance: gdInitialInstance,
    associatedObjectConfiguration: gdObjectConfiguration,
    pixiContainer: PIXI.Container,
    threeGroup: THREE.Group,
    pixiResourcesLoader: Class<PixiResourcesLoader>
  ) {
    super(
      project,
      instance,
      associatedObjectConfiguration,
      pixiContainer,
      threeGroup,
      pixiResourcesLoader
    );

    this._renderedAnimation = 0;
    this._renderedDirection = 0;
    this._centerX = 0;
    this._centerY = 0;
    this._originX = 0;
    this._originY = 0;

    this._pixiObject = new PIXI.Graphics();
    this._pixiContainer.addChild(this._pixiObject);

    this.updateSprite();
    const geometry = new THREE.PlaneGeometry(1, -1);
    // Set a white tint.
    vertexColors.length = geometry.attributes.position.count * 3;
    vertexColors.fill(1);
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(vertexColors), 3)
    );

    const threeObject = new THREE.Mesh(geometry, getTransparentMaterial());
    threeObject.rotation.order = 'ZYX';
    this._threeGroup.add(threeObject);
    this._threeObject = threeObject;

    this.updateTextureAndSprite();
  }

}
