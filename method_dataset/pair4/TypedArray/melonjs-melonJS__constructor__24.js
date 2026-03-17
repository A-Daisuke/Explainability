function __method_wrapper__() {
	constructor(options) {
		/**
		 * The renderer renderTarget
		 * @name renderTarget
		 * @type {CanvasRenderTarget}
		 */
		this.renderTarget = new CanvasRenderTarget(
			options.width,
			options.height,
			// support case when a global canvas is available, e.g. webapp adapter for wechat
			typeof globalThis.canvas !== "undefined"
				? Object.assign(options, { canvas: globalThis.canvas })
				: options,
		);

		/**
		 * The given constructor options
		 * @public
		 * @type {object}
		 */
		this.settings = options;

		/**
		 * the requested video size ratio
		 * @public
		 * @type {number}
		 */
		this.designRatio = this.settings.width / this.settings.height;

		/**
		 * the scaling ratio to be applied to the main canvas
		 * @type {Vector2d}
		 * @default <1,1>
		 */
		this.scaleRatio = new Vector2d(this.settings.scale, this.settings.scale);

		/**
		 * true if the current rendering context is valid
		 * @default true
		 * @type {boolean}
		 */
		this.isContextValid = true;

		/**
		 * the default method to sort object ("sorting", "z-buffer")
		 * @type {string}
		 * @default "sorting"
		 */
		this.depthTest = "sorting";

		/**
		 * The Path2D instance used by the renderer to draw primitives
		 * @type {Path2D}
		 */
		this.path2D = new Path2D();

		/**
		 * The renderer type : Canvas, WebGL, etc...
		 * (override this property with a specific value when implementing a custom renderer)
		 * @type {string}
		 */
		this.type = "Generic";

		/**
		 * The background color used to clear the main framebuffer.
		 * Note: alpha value will be set based on the transparent property of the renderer settings.
		 * @default black
		 * @type {Color}
		 */
		this.backgroundColor = new Color(
			0,
			0,
			0,
			this.settings.transparent ? 0.0 : 1.0,
		);

		/**
		 * @ignore
		 */
		this.currentScissor = new Int32Array([
			0,
			0,
			this.settings.width,
			this.settings.height,
		]);

		/**
		 * @ignore
		 */
		this.maskLevel = 0;

		/**
		 * @ignore
		 */
		this.currentBlendMode = "none";

		// global color
		this.currentColor = new Color(0, 0, 0, 1.0);

		// global tint color
		this.currentTint = new Color(255, 255, 255, 1.0);

		// the projectionMatrix (set through setProjection)
		this.projectionMatrix = new Matrix3d();

		// default uvOffset
		this.uvOffset = 0;
	}

}
