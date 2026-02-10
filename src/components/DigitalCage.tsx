import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Reduced-motion helper                                              */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/*  Sophisticated wireframe chamber with subtle human form             */
/* ------------------------------------------------------------------ */

interface ChamberProps {
  isRevealed: boolean;
  reducedMotion: boolean;
}

function Chamber({ isRevealed, reducedMotion }: ChamberProps) {
  const chamberRef = useRef<THREE.Group>(null);
  const figureRef = useRef<THREE.Group>(null);
  
  // Create sophisticated chamber geometry
  const chamberGeometry = useMemo(() => {
    const group = new THREE.Group();
    
    // Main chamber - larger, more imposing
    const mainChamber = new THREE.BoxGeometry(3.2, 3.8, 3.2);
    const mainEdges = new THREE.EdgesGeometry(mainChamber);
    
    // Inner grid lines for depth
    const innerGeometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // Vertical grid lines
    for (let i = -1; i <= 1; i += 0.5) {
      for (let j = -1; j <= 1; j += 0.5) {
        vertices.push(i, -1.9, j, i, 1.9, j);
        vertices.push(i, j, -1.6, i, j, 1.6);
      }
    }
    
    // Horizontal grid lines
    for (let i = -1.6; i <= 1.6; i += 0.4) {
      for (let j = -1.6; j <= 1.6; j += 0.4) {
        vertices.push(-1.6, i, j, 1.6, i, j);
      }
    }
    
    innerGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    group.add(new THREE.LineSegments(mainEdges));
    group.add(new THREE.LineSegments(innerGeometry));
    
    return group;
  }, []);

  // Create elegant human figure using simple geometry
  const figureGeometry = useMemo(() => {
    const group = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.15, 8, 6);
    const headWireframe = new THREE.WireframeGeometry(headGeometry);
    const head = new THREE.LineSegments(headWireframe);
    head.position.y = 0.85;
    group.add(head);
    
    // Body - simplified rectangular form
    const bodyGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.2);
    const bodyWireframe = new THREE.WireframeGeometry(bodyGeometry);
    const body = new THREE.LineSegments(bodyWireframe);
    body.position.y = 0.2;
    group.add(body);
    
    // Arms - simple cylinders
    const armGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6);
    const armWireframe = new THREE.WireframeGeometry(armGeometry);
    
    const leftArm = new THREE.LineSegments(armWireframe);
    leftArm.position.set(-0.3, 0.4, 0);
    leftArm.rotation.z = 0.3;
    group.add(leftArm);
    
    const rightArm = new THREE.LineSegments(armWireframe);
    rightArm.position.set(0.3, 0.4, 0);
    rightArm.rotation.z = -0.3;
    group.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6);
    const legWireframe = new THREE.WireframeGeometry(legGeometry);
    
    const leftLeg = new THREE.LineSegments(legWireframe);
    leftLeg.position.set(-0.1, -0.6, 0);
    group.add(leftLeg);
    
    const rightLeg = new THREE.LineSegments(legWireframe);
    rightLeg.position.set(0.1, -0.6, 0);
    group.add(rightLeg);
    
    return group;
  }, []);

  // Materials with sophisticated shading
  const chamberMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({
      color: isRevealed ? '#ff3333' : '#444444',
      transparent: true,
      opacity: isRevealed ? 0.9 : 0.4,
      linewidth: 1,
    }),
    [isRevealed]
  );

  const figureMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({
      color: isRevealed ? '#ff6666' : '#666666',
      transparent: true,
      opacity: isRevealed ? 0.7 : 0.3,
      linewidth: 1,
    }),
    [isRevealed]
  );

  // Smooth rotation animation
  useFrame((state, delta) => {
    if (!chamberRef.current || reducedMotion) return;
    
    const time = state.clock.elapsedTime;
    
    // Smooth continuous rotation
    chamberRef.current.rotation.y += delta * (isRevealed ? 0.6 : 0.3);
    
    // Subtle figure movement when revealed
    if (figureRef.current && isRevealed) {
      figureRef.current.position.y = Math.sin(time * 0.5) * 0.05 - 0.1;
      figureRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  // Apply materials to all geometry
  useEffect(() => {
    if (chamberRef.current) {
      chamberRef.current.traverse((child) => {
        if (child instanceof THREE.LineSegments) {
          child.material = chamberMaterial;
        }
      });
    }
    if (figureRef.current) {
      figureRef.current.traverse((child) => {
        if (child instanceof THREE.LineSegments) {
          child.material = figureMaterial;
        }
      });
    }
  }, [chamberMaterial, figureMaterial]);

  // Cleanup
  useEffect(() => {
    return () => {
      chamberGeometry.traverse((child) => {
        if (child instanceof THREE.LineSegments) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      figureGeometry.traverse((child) => {
        if (child instanceof THREE.LineSegments) {
          child.geometry.dispose();
        }
      });
      chamberMaterial.dispose();
      figureMaterial.dispose();
    };
  }, [chamberGeometry, figureGeometry, chamberMaterial, figureMaterial]);

  return (
    <group>
      <group ref={chamberRef}>
        <primitive object={chamberGeometry} />
      </group>
      <group ref={figureRef} position={[0, -0.1, 0]}>
        <primitive object={figureGeometry} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Enhanced lighting and scene composition                            */
/* ------------------------------------------------------------------ */

function SceneLighting({ isRevealed }: { isRevealed: boolean }) {
  const { gl } = useThree();
  
  useEffect(() => {
    // Optimize renderer settings for better performance and quality
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.8;
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  return (
    <>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={isRevealed ? 0.3 : 0.15} color="#ffffff" />
      
      {/* Key light from top-front */}
      <directionalLight 
        position={[2, 4, 3]} 
        intensity={isRevealed ? 0.8 : 0.4}
        color={isRevealed ? "#ff4444" : "#666666"}
      />
      
      {/* Fill light from back */}
      <directionalLight 
        position={[-1, 1, -2]} 
        intensity={0.2}
        color="#0088ff"
      />
      
      {/* Rim light for dramatic edge lighting */}
      <directionalLight 
        position={[0, 0, -3]} 
        intensity={isRevealed ? 0.4 : 0.2}
        color="#ffffff"
      />
    </>
  );
}

interface CageSceneProps {
  isRevealed: boolean;
  reducedMotion: boolean;
}

function CageScene({ isRevealed, reducedMotion }: CageSceneProps) {
  return (
    <>
      <SceneLighting isRevealed={isRevealed} />
      <Chamber isRevealed={isRevealed} reducedMotion={reducedMotion} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Enhanced CSS-only fallback                                         */
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
        perspective: '600px',
      }}
    >
      {/* Chamber outline */}
      <div
        style={{
          width: 160,
          height: 190,
          border: '1px solid #444',
          borderRadius: '2px',
          position: 'relative',
          transformStyle: 'preserve-3d' as const,
          animation: 'chamber-rotate 12s linear infinite',
          boxShadow: 'inset 0 0 20px rgba(68, 68, 68, 0.2)',
        }}
      >
        {/* Interior grid lines */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            right: '20%',
            bottom: '20%',
            borderTop: '1px solid #333',
            borderLeft: '1px solid #333',
            opacity: 0.5,
          }}
        />
        
        {/* Figure representation */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '60px',
            background: 'linear-gradient(to bottom, #666 0%, #666 15%, transparent 15%, transparent 30%, #666 30%, #666 70%, transparent 70%, transparent 85%, #666 85%, #666 100%)',
            borderRadius: '2px',
            opacity: 0.6,
          }}
        />
      </div>
      
      <style>{`
        @keyframes chamber-rotate {
          from { transform: rotateY(0deg) rotateX(5deg); }
          to   { transform: rotateY(360deg) rotateX(5deg); }
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
  const observerRef = useRef<MutationObserver | null>(null);

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

    // Performance: Reuse observer reference to prevent memory leaks
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          check();
          break; // Early exit for performance
        }
      }
    });

    observerRef.current.observe(body, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  /* Container styles — refined positioning and transitions */
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
    transition: 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother easing
    filter: revealed ? 'contrast(1.1) saturate(1.2)' : 'none', // Enhanced visual impact
  };

  return (
    <>
      {/* Enhanced responsive sizing with better mobile optimization */}
      <style>{`
        .digital-chamber-container {
          width: 400px !important;
          height: 400px !important;
          filter: drop-shadow(0 0 20px rgba(255, 51, 51, 0.1));
        }
        .reveal-state .digital-chamber-container {
          filter: drop-shadow(0 0 30px rgba(255, 51, 51, 0.3));
          animation: chamber-glow 3s ease-in-out infinite alternate;
        }
        @keyframes chamber-glow {
          from { filter: drop-shadow(0 0 20px rgba(255, 51, 51, 0.2)); }
          to   { filter: drop-shadow(0 0 40px rgba(255, 51, 51, 0.4)); }
        }
        @media (max-width: 640px) {
          .digital-chamber-container {
            width: 300px !important;
            height: 300px !important;
          }
        }
        @media (max-width: 480px) {
          .digital-chamber-container {
            width: 250px !important;
            height: 250px !important;
          }
        }
        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .digital-chamber-container {
            animation: none !important;
          }
        }
      `}</style>

      <div className="digital-chamber-container" style={containerStyle} suppressHydrationWarning>
        {canvasError ? (
          <CssFallback />
        ) : (
          <Suspense fallback={<CssFallback />}>
            <ErrorBoundary onError={() => setCanvasError(true)}>
              <Canvas
                gl={{ 
                  antialias: true, 
                  alpha: true,
                  powerPreference: 'high-performance',
                  stencil: false,
                  depth: true, // Enable depth buffer for proper 3D rendering
                  preserveDrawingBuffer: false,
                  logarithmicDepthBuffer: true, // Better depth precision
                }}
                dpr={[1, typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio) : 2]}
                camera={{ 
                  position: [0, 0, 6],
                  fov: 45,
                  near: 0.1,
                  far: 100,
                }}
                frameloop={reducedMotion ? 'demand' : 'always'}
                style={{ background: 'transparent' }}
                performance={{ min: 0.5 }}
                onCreated={(state) => {
                  // Enhanced renderer configuration
                  state.gl.toneMapping = THREE.ACESFilmicToneMapping;
                  state.gl.toneMappingExposure = 0.8;
                  state.gl.shadowMap.enabled = false; // Shadows not needed for wireframe
                  state.gl.setPixelRatio(Math.min(2, window.devicePixelRatio));
                  state.gl.setClearColor(0x000000, 0);
                }}
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
