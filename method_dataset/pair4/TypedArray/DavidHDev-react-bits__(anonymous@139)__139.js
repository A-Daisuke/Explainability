function __method_wrapper__() {
  useEffect(() => {
    if (isMobile) return;

    const renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 1),
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    containerRef.current.appendChild(gl.canvas);

    const camera = new Camera(gl);
    const scene = new Transform();

    const geometry = new Geometry(gl, { position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) } });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: uniformResolution.current },
        uOffset: { value: uniformOffset.current },
        uRotation: { value: 0 },
        focalLength: { value: focalLength },
        speed1: { value: speed1 },
        speed2: { value: speed2 },
        dir2: { value: dir2 },
        bend1: { value: bend1 },
        bend2: { value: bend2 },
        bendAdj1: { value: 0 },
        bendAdj2: { value: 0 },
        uOpacity: { value: 0 }
      }
    });
    new Mesh(gl, { geometry, program }).setParent(scene);

    const applySize = () => {
      const el = containerRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      const rw = width * renderer.dpr,
        rh = height * renderer.dpr;
      if (rw === uniformResolution.current[0] && rh === uniformResolution.current[1]) return;
      renderer.setSize(width, height);
      uniformResolution.current[0] = rw;
      uniformResolution.current[1] = rh;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };

    applySize();

    const resize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        applySize();
        resizeTimeoutRef.current = null;
      }, 150);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(containerRef.current);

    startTimeRef.current = performance.now();

    const loop = now => {
      const {
        xOffset: xOff,
        yOffset: yOff,
        rotationDeg: rot,
        focalLength: fLen,
        fadeInDuration: fadeDur
      } = propsRef.current;
      const t = (now - startTimeRef.current) * 0.001;
      if (fadeStartTime.current === null && t > 0.1) fadeStartTime.current = now;
      let opacity = 0;
      if (fadeStartTime.current !== null) {
        const fe = now - fadeStartTime.current;
        opacity = Math.min(fe / fadeDur, 1);
        opacity = 1 - Math.pow(1 - opacity, 3);
      }
      uniformOffset.current[0] = xOff;
      uniformOffset.current[1] = yOff;
      program.uniforms.iTime.value = t;
      program.uniforms.uRotation.value = (rot * Math.PI) / 180;
      program.uniforms.focalLength.value = fLen;
      program.uniforms.uOpacity.value = opacity;
      renderer.render({ scene, camera });
      if (runningRef.current) rafRef.current = requestAnimationFrame(loop);
    };
    const start = () => {
      if (runningRef.current || permaPausedRef.current) return;
      runningRef.current = true;
      startTimeRef.current = performance.now() - program.uniforms.iTime.value * 1000;
      if (dynamicDpr) {
        const target = Math.min(window.devicePixelRatio, 1);
        if (renderer.dpr !== target) renderer.dpr = target;
      }
      renderer.render({ scene, camera });
      rafRef.current = requestAnimationFrame(loop);
    };
    const stop = () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    startStopApiRef.current = { start, stop };

    start();

    const containerEl = containerRef.current;
    if (pauseWhenOffscreen && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        e => {
          const n = e[0];
          if (!n) return;
          if (n.isIntersecting) start();
          else stop();
        },
        { root: null, rootMargin, threshold: 0 }
      );
      if (containerEl) observerRef.current.observe(containerEl);
    }

    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
      if (observerRef.current && containerEl) {
        if (typeof observerRef.current.unobserve === 'function') observerRef.current.unobserve(containerEl);
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      renderer.gl.canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

}
