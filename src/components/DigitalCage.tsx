import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Reduced-motion helper                                              */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/*  Humanoid silhouette shape                                          */
/* ------------------------------------------------------------------ */

function createSilhouetteShape(): THREE.Shape {
  const shape = new THREE.Shape();

  // Head (circle approximation at the top)
  const headRadius = 0.25;
  const headCenterY = 1.05;
  const segments = 16;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * headRadius;
    const y = Math.sin(angle) * headRadius + headCenterY;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  // Neck
  shape.moveTo(-0.06, headCenterY - headRadius);
  shape.lineTo(-0.06, 0.7);

  shape.lineTo(0.06, 0.7);
  shape.lineTo(0.06, headCenterY - headRadius);

  // Torso
  shape.moveTo(-0.3, 0.7);
  shape.lineTo(-0.3, -0.1);
  shape.lineTo(0.3, -0.1);
  shape.lineTo(0.3, 0.7);
  shape.lineTo(-0.3, 0.7);

  // Left arm
  shape.moveTo(-0.3, 0.6);
  shape.lineTo(-0.55, 0.0);
  shape.lineTo(-0.45, -0.02);
  shape.lineTo(-0.22, 0.5);

  // Right arm
  shape.moveTo(0.3, 0.6);
  shape.lineTo(0.55, 0.0);
  shape.lineTo(0.45, -0.02);
  shape.lineTo(0.22, 0.5);

  // Left leg
  shape.moveTo(-0.2, -0.1);
  shape.lineTo(-0.3, -0.9);
  shape.lineTo(-0.18, -0.92);
  shape.lineTo(-0.1, -0.12);

  // Right leg
  shape.moveTo(0.2, -0.1);
  shape.lineTo(0.3, -0.9);
  shape.lineTo(0.18, -0.92);
  shape.lineTo(0.1, -0.12);

  return shape;
}

/* ------------------------------------------------------------------ */
/*  Cage mesh                                                          */
/* ------------------------------------------------------------------ */

interface CageProps {
  isRevealed: boolean;
  reducedMotion: boolean;
}

function Cage({ isRevealed, reducedMotion }: CageProps) {
  const ref = useRef<THREE.LineSegments>(null);

  const edgesGeometry = useMemo(() => {
    const box = new THREE.BoxGeometry(2.5, 3, 2.5);
    return new THREE.EdgesGeometry(box);
  }, []);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: isRevealed ? '#ff3333' : '#333333',
        transparent: true,
        opacity: isRevealed ? 0.8 : 0.3,
      }),
    [isRevealed],
  );

  useFrame((_state, delta) => {
    if (!ref.current || reducedMotion) return;
    const speed = isRevealed ? 0.5 : 0.2;
    ref.current.rotation.y += delta * speed;
  });

  return <lineSegments ref={ref} geometry={edgesGeometry} material={material} />;
}

/* ------------------------------------------------------------------ */
/*  Silhouette mesh                                                    */
/* ------------------------------------------------------------------ */

interface SilhouetteProps {
  isRevealed: boolean;
  reducedMotion: boolean;
}

function Silhouette({ isRevealed, reducedMotion }: SilhouetteProps) {
  const ref = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const shape = createSilhouetteShape();
    return new THREE.ShapeGeometry(shape);
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: isRevealed ? '#ff3333' : '#666666',
        transparent: true,
        opacity: isRevealed ? 0.6 : 0.2,
        side: THREE.DoubleSide,
      }),
    [isRevealed],
  );

  useFrame(() => {
    if (!ref.current) return;
    if (isRevealed && !reducedMotion) {
      // Subtle glitch jitter
      ref.current.position.x = (Math.random() - 0.5) * 0.06;
      ref.current.position.y = (Math.random() - 0.5) * 0.04;
    } else {
      ref.current.position.x = 0;
      ref.current.position.y = 0;
    }
  });

  return (
    <mesh ref={ref} geometry={geometry} material={material} position={[0, -0.1, 0]} />
  );
}

/* ------------------------------------------------------------------ */
/*  Scene composition                                                  */
/* ------------------------------------------------------------------ */

interface CageSceneProps {
  isRevealed: boolean;
  reducedMotion: boolean;
}

function CageScene({ isRevealed, reducedMotion }: CageSceneProps) {
  return (
    <>
      <ambientLight intensity={1} />
      <Cage isRevealed={isRevealed} reducedMotion={reducedMotion} />
      <Silhouette isRevealed={isRevealed} reducedMotion={reducedMotion} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  CSS-only fallback                                                  */
/* ------------------------------------------------------------------ */

function CssFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 120,
          height: 150,
          border: '1px solid #333',
          transformStyle: 'preserve-3d' as const,
          animation: 'digital-cage-rotate 10s linear infinite',
        }}
      />
      <style>{`
        @keyframes digital-cage-rotate {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported component                                                 */
/* ------------------------------------------------------------------ */

interface DigitalCageProps {
  isRevealed?: boolean;
}

export default function DigitalCage({ isRevealed: propRevealed = false }: DigitalCageProps) {
  const [revealed, setRevealed] = useState(() => {
    // Check sessionStorage on client to match TheSwitch's persisted state
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('onlybots-switched') === 'true';
      } catch {
        return propRevealed;
      }
    }
    return propRevealed;
  });
  const [mounted, setMounted] = useState(false);
  const [canvasError, setCanvasError] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  /* Mark as mounted to avoid hydration issues with dynamic styles */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* Sync prop changes */
  useEffect(() => {
    if (propRevealed) setRevealed(true);
  }, [propRevealed]);

  /* Watch for body.reveal-state via MutationObserver */
  useEffect(() => {
    const body = document.body;

    const check = () => {
      if (body.classList.contains('reveal-state')) setRevealed(true);
    };

    // Initial check
    check();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          check();
        }
      }
    });

    observer.observe(body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  /* Container styles — use 0 opacity during SSR, then resolve on client */
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    zIndex: 10,
    pointerEvents: 'none' as const,
    opacity: mounted && revealed ? 1 : 0,
    transition: 'opacity 1.2s ease',
  };

  return (
    <>
      {/* Responsive sizing override for mobile */}
      <style>{`
        .digital-cage-container {
          width: 400px !important;
          height: 400px !important;
        }
        @media (max-width: 640px) {
          .digital-cage-container {
            width: 280px !important;
            height: 280px !important;
          }
        }
      `}</style>

      <div className="digital-cage-container" style={containerStyle} suppressHydrationWarning>
        {canvasError ? (
          <CssFallback />
        ) : (
          <Suspense fallback={<CssFallback />}>
            <ErrorBoundary onError={() => setCanvasError(true)}>
              <Canvas
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
                camera={{ position: [0, 0, 5] }}
                frameloop={reducedMotion ? 'demand' : 'always'}
                style={{ background: 'transparent' }}
              >
                <CageScene isRevealed={revealed} reducedMotion={reducedMotion} />
              </Canvas>
            </ErrorBoundary>
          </Suspense>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Minimal error boundary                                             */
/* ------------------------------------------------------------------ */

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    this.props.onError();
  }

  render(): ReactNode {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
