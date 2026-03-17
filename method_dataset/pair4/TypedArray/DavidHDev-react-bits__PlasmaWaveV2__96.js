export default function PlasmaWaveV2({
  xOffset = 0,
  yOffset = 0,
  rotationDeg = 0,
  focalLength = 0.8,
  speed1 = 0.05,
  speed2 = 0.05,
  dir2 = 1.0,
  bend1 = 1,
  bend2 = 0.5,
  fadeInDuration = 2000,
  pauseWhenOffscreen = true,
  rootMargin = '200px',
  autoPauseOnScroll = true,
  scrollPauseThreshold = null,
  resumeOnScrollUp = false,
  dynamicDpr = false
}) {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const uniformOffset = useRef(new Float32Array([xOffset, yOffset]));
  const uniformResolution = useRef(new Float32Array([1, 1]));
  const rendererRef = useRef(null);
  const fadeStartTime = useRef(null);
  const startTimeRef = useRef(0);
  const resizeTimeoutRef = useRef(null);
  const rafRef = useRef(null);
  const runningRef = useRef(false);
  const observerRef = useRef(null);
  const permaPausedRef = useRef(false);
  const startStopApiRef = useRef({ start: () => {}, stop: () => {} });
  const appliedScrollThresholdRef = useRef(null);

  const propsRef = useRef({});
  propsRef.current = { xOffset, yOffset, rotationDeg, focalLength, speed1, speed2, dir2, bend1, bend2, fadeInDuration };

  useEffect(() => {
    const f = () => setIsMobile(window.innerWidth <= 768);
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);

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

  useEffect(() => {
    if (isMobile || !autoPauseOnScroll) return;
    if (!appliedScrollThresholdRef.current)
      appliedScrollThresholdRef.current = scrollPauseThreshold ?? Math.round(window.innerHeight * 1.2);
    const limit = appliedScrollThresholdRef.current;
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      if (!permaPausedRef.current && y > limit) {
        startStopApiRef.current.stop();
        if (!resumeOnScrollUp) permaPausedRef.current = true;
      } else if (resumeOnScrollUp && y <= limit && !permaPausedRef.current) {
        startStopApiRef.current.start();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile, autoPauseOnScroll, scrollPauseThreshold, resumeOnScrollUp]);

  if (isMobile) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        willChange: 'opacity'
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(to top, #060010, transparent)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
    </div>
  );
}
