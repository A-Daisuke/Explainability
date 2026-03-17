function __method_wrapper__() {
    private _setup3DRendering(
      pixiRenderer: PIXI.Renderer | null,
      runtimeInstanceContainerRenderer: gdjs.RuntimeInstanceContainerRenderer
    ): void {
      if (typeof THREE === 'undefined') {
        return;
      }
      // TODO (3D): ideally we would avoid the need for this check at all,
      // maybe by having separate rendering classes for custom object layers and scene layers.
      if (this._layer instanceof gdjs.Layer) {
        if (
          this._layer.getRenderingType() ===
            gdjs.RuntimeLayerRenderingType.THREE_D ||
          this._layer.getRenderingType() ===
            gdjs.RuntimeLayerRenderingType.TWO_D_PLUS_THREE_D
        ) {
          if (this._threeScene || this._threeGroup || this._threeCamera) {
            throw new Error(
              'Tried to setup 3D rendering for a layer that is already set up.'
            );
          }

          this._threeScene = new THREE.Scene();

          // Use a mirroring on the Y axis to follow the same axis as in the 2D, PixiJS, rendering.
          // We use a mirroring rather than a camera rotation so that the Z order is not changed.
          this._threeScene.scale.y = -1;

          this._threeGroup = new THREE.Group();
          this._threeScene.add(this._threeGroup);

          if (
            this._layer.getCameraType() ===
            gdjs.RuntimeLayerCameraType.ORTHOGRAPHIC
          ) {
            const width = this._layer.getWidth();
            const height = this._layer.getHeight();
            this._threeCamera = new THREE.OrthographicCamera(
              -width / 2,
              width / 2,
              height / 2,
              -height / 2,
              this._layer.getInitialCamera3DNearPlaneDistance(),
              this._layer.getInitialCamera3DFarPlaneDistance()
            );
          } else {
            this._threeCamera = new THREE.PerspectiveCamera(
              this._layer.getInitialCamera3DFieldOfView(),
              1,
              this._layer.getInitialCamera3DNearPlaneDistance(),
              this._layer.getInitialCamera3DFarPlaneDistance()
            );
          }
          this._threeCamera.rotation.order = 'ZYX';

          const game = this._layer.getRuntimeScene().getGame();
          const threeRenderer = game.getRenderer().getThreeRenderer();
          if (threeRenderer) {
            // When adding more default passes, make sure to update
            // `addPostProcessingPass` and `hasPostProcessingPass` formulas.
            this._threeEffectComposer = new THREE_ADDONS.EffectComposer(
              threeRenderer
            );
            this._threeEffectComposer.addPass(
              new THREE_ADDONS.RenderPass(this._threeScene, this._threeCamera)
            );
            if (game.getAntialiasingMode() !== 'none') {
              this._threeEffectComposer.addPass(
                new THREE_ADDONS.SMAAPass(
                  game.getGameResolutionWidth(),
                  game.getGameResolutionHeight()
                )
              );
            }
            this._threeEffectComposer.addPass(new THREE_ADDONS.OutputPass());
          }

          if (
            this._layer.getRenderingType() ===
            gdjs.RuntimeLayerRenderingType.TWO_D_PLUS_THREE_D
          ) {
            if (
              this._renderTexture ||
              this._threePlaneGeometry ||
              this._threePlaneMaterial ||
              this._threePlaneTexture ||
              this._threePlaneMesh
            )
              throw new Error(
                'Tried to setup PixiJS plane for 2D rendering in 3D for a layer that is already set up.'
              );

            // If we have both 2D and 3D objects to be rendered, create a render texture that PixiJS will use
            // to render, and that will be projected on a plane by Three.js
            this._createPixiRenderTexture(pixiRenderer);

            // Create the plane that will show this texture.
            this._threePlaneGeometry = new THREE.PlaneGeometry(1, 1);

            // Create the texture to project on the plane.
            // Use a buffer to create a "fake" DataTexture, just so the texture
            // is considered initialized by Three.js.
            const width = 1;
            const height = 1;
            const size = width * height;
            const data = new Uint8Array(4 * size);
            const texture = new THREE.DataTexture(data, width, height);
            texture.needsUpdate = true;

            this._threePlaneTexture = texture;
            this._threePlaneTexture.generateMipmaps = false;
            const filter =
              this._layer.getRuntimeScene().getGame().getScaleMode() ===
              'nearest'
                ? THREE.NearestFilter
                : THREE.LinearFilter;
            this._threePlaneTexture.minFilter = filter;
            this._threePlaneTexture.magFilter = filter;
            this._threePlaneTexture.wrapS = THREE.ClampToEdgeWrapping;
            this._threePlaneTexture.wrapT = THREE.ClampToEdgeWrapping;
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
            this._threePlaneMaterial = new THREE.ShaderMaterial(
              noGammaCorrectionShader
            );
            this._threePlaneMaterial;

            // Finally, create the mesh shown in the scene.
            this._threePlaneMesh = new THREE.Mesh(
              this._threePlaneGeometry,
              this._threePlaneMaterial
            );

            // Force to render the mesh last (after the rest of 3D objects, including
            // transparent ones). In most cases, the 2D rendering is composed of a lot
            // of transparent areas, and we can't risk it being displayed first and wrongly
            // occluding 3D objects shown behind.
            this._threePlaneMesh.renderOrder = Number.MAX_SAFE_INTEGER;
            this._threeScene.add(this._threePlaneMesh);
          }

          // Note: we can not update the position of the camera at this point,
          // because the layer might not be fully constructed.
          // See `onCreated`.
        }
      } else {
        // This is a layer of a custom object.

        const parentThreeObject =
          runtimeInstanceContainerRenderer.get3DRendererObject();
        if (!parentThreeObject) {
          // No parent 3D renderer object, 3D is disabled.
          return;
        }

        if (!this._threeGroup) {
          // TODO (3D) - optimization: do not create a THREE.Group if no 3D object are contained inside.
          this._threeGroup = new THREE.Group();
          parentThreeObject.add(this._threeGroup);
        }
      }
    }

}
