function __method_wrapper__() {
  _setup3dRendering(pixiRenderer: PIXI.Renderer): void {
    if (this._threeScene || this._threeGroup || this._threeCamera) {
      throw new Error(
        'Tried to setup 3D rendering for a layer that is already set up.'
      );
    }

    const threeScene = new THREE.Scene();
    this._threeScene = threeScene;

    // Use a mirroring on the Y axis to follow the same axis as in the 2D, PixiJS, rendering.
    // We use a mirroring rather than a camera rotation so that the Z order is not changed.
    threeScene.scale.y = -1;

    this._threeGroup = new THREE.Group();
    this._threeGroup.rotation.order = 'ZYX';
    threeScene.add(this._threeGroup);

    const light = new THREE.HemisphereLight();
    light.color = new THREE.Color(1, 1, 1);
    light.groundColor = new THREE.Color(0.25, 0.25, 0.25);
    light.position.set(0, 0, 1);
    const lightGroup = new THREE.Group();
    lightGroup.rotation.order = 'ZYX';
    lightGroup.rotation.x = Math.PI / 4;
    lightGroup.add(light);
    threeScene.add(lightGroup);

    const threeCamera = new THREE.PerspectiveCamera(45, 1, 3, 2000);
    threeCamera.rotation.order = 'ZYX';
    this._threeCamera = threeCamera;

    if (
      this._renderTexture ||
      this._threePlaneGeometry ||
      this._threePlaneMaterial ||
      this._threePlaneTexture ||
      this._threePlaneMesh
    ) {
      throw new Error(
        'Tried to setup PixiJS plane for 2D rendering in 3D for a layer that is already set up.'
      );
    }

    // If we have both 2D and 3D objects to be rendered, create a render texture that PixiJS will use
    // to render, and that will be projected on a plane by Three.js
    this._createPixiRenderTexture(pixiRenderer);

    // Create the texture to project on the plane.
    // Use a buffer to create a "fake" DataTexture, just so the texture
    // is considered initialized by Three.js.
    const width = 1;
    const height = 1;
    const size = width * height;
    const data = new Uint8Array(4 * size);
    const threePlaneTexture = new THREE.DataTexture(data, width, height);
    threePlaneTexture.needsUpdate = true;
    this._threePlaneTexture = threePlaneTexture;

    threePlaneTexture.generateMipmaps = false;
    const filter =
      this.project.getScaleMode() === 'nearest'
        ? THREE.NearestFilter
        : THREE.LinearFilter;
    threePlaneTexture.minFilter = filter;
    threePlaneTexture.magFilter = filter;
    threePlaneTexture.wrapS = THREE.ClampToEdgeWrapping;
    threePlaneTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Create the plane that will show this texture.
    const threePlaneGeometry = new THREE.PlaneGeometry(1, 1);
    this._threePlaneGeometry = threePlaneGeometry;
    // This disable the gamma correction done by THREE as PIXI is already doing it.
    const noGammaCorrectionShader: THREE.ShaderMaterialParameters = {
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        varying vec2 vUv;
        void main() {
          vec4 texel = texture2D(map, vUv);
          gl_FragColor = texel;
        }
      `,
      uniforms: {
        map: { value: this._threePlaneTexture },
      },
      side: THREE.FrontSide,
      transparent: true,
    };
    const threePlaneMaterial = new THREE.ShaderMaterial(
      noGammaCorrectionShader
    );
    this._threePlaneMaterial = threePlaneMaterial;

    // Finally, create the mesh shown in the scene.
    const threePlaneMesh = new THREE.Mesh(
      threePlaneGeometry,
      threePlaneMaterial
    );
    threeScene.add(threePlaneMesh);
    this._threePlaneMesh = threePlaneMesh;
  }

}
