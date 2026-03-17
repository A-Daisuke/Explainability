function __method_wrapper__() {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new Renderer({ dpr, alpha: false, antialias: false });
    rendererRef.current = renderer;

    const gl = renderer.gl;
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.mixBlendMode = mixBlendMode && mixBlendMode !== 'none' ? mixBlendMode : '';
    container.appendChild(gl.canvas);

    const white = new Uint8Array([255, 255, 255, 255]);
    const gradientTex = new Texture(gl, {
      image: white,
      width: 1,
      height: 1,
      generateMipmaps: false,
      flipY: false
    });

    gradientTex.minFilter = gl.LINEAR;
    gradientTex.magFilter = gl.LINEAR;
    gradientTex.wrapS = gl.CLAMP_TO_EDGE;
    gradientTex.wrapT = gl.CLAMP_TO_EDGE;
    gradTexRef.current = gradientTex;

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uResolution: { value: [1, 1] as [number, number] },
        uTime: { value: 0 },

        uIntensity: { value: 1 },
        uSpeed: { value: 1 },
        uAnimType: { value: 0 },
        uMouse: { value: [0.5, 0.5] as [number, number] },
        uColorCount: { value: 0 },
        uDistort: { value: 0 },
        uOffset: { value: [0, 0] as [number, number] },
        uGradient: { value: gradientTex },
        uNoiseAmount: { value: 0.8 },
        uRayCount: { value: 0 }
      }
    });

    programRef.current = program;

    const triangle = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry: triangle, program });
    triRef.current = triangle;
    meshRef.current = mesh;

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };

    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(resize);
      ro.observe(container);
    } else {
      (window as Window).addEventListener('resize', resize);
    }
    resize();

    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      const y = (e.clientY - rect.top) / Math.max(rect.height, 1);
      mouseTargetRef.current = [Math.min(Math.max(x, 0), 1), Math.min(Math.max(y, 0), 1)];
    };
    container.addEventListener('pointermove', onPointer, { passive: true });

    let io: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        entries => {
          if (entries[0]) isVisibleRef.current = entries[0].isIntersecting;
        },
        { root: null, threshold: 0.01 }
      );
      io.observe(container);
    }
    const onVis = () => {};
    document.addEventListener('visibilitychange', onVis);

    let raf = 0;
    let last = performance.now();
    let accumTime = 0;

    const update = (now: number) => {
      const dt = Math.max(0, now - last) * 0.001;
      last = now;
      const visible = isVisibleRef.current && !document.hidden;
      if (!pausedRef.current) accumTime += dt;
      if (!visible) {
        raf = requestAnimationFrame(update);
        return;
      }
      const tau = 0.02 + Math.max(0, Math.min(1, hoverDampRef.current)) * 0.5;
      const alpha = 1 - Math.exp(-dt / tau);
      const tgt = mouseTargetRef.current;
      const sm = mouseSmoothRef.current;
      sm[0] += (tgt[0] - sm[0]) * alpha;
      sm[1] += (tgt[1] - sm[1]) * alpha;
      program.uniforms.uMouse.value = sm as any;
      program.uniforms.uTime.value = accumTime;
      renderer.render({ scene: meshRef.current! });
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('pointermove', onPointer);
      ro?.disconnect();
      if (!ro) window.removeEventListener('resize', resize);
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      try {
        container.removeChild(gl.canvas);
      } catch (e) {
        void e;
      }
      meshRef.current = null;
      triRef.current = null;
      programRef.current = null;
      try {
        const glCtx = rendererRef.current?.gl;
        if (glCtx && gradTexRef.current?.texture) glCtx.deleteTexture(gradTexRef.current.texture);
      } catch (e) {
        void e;
      }
      programRef.current = null;
      rendererRef.current = null;
      gradTexRef.current = null;
      meshRef.current = null;
      triRef.current = null;
    };
  }, []);

}
