---
name: three-js-scene
description: Three.js scene patterns for onlybots.cam's DigitalCage component using @react-three/fiber and @react-three/drei. Use when creating or editing 3D scene elements.
---

# Three.js Scene Skill (React Three Fiber)

## Scene Setup Pattern

```tsx
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

export default function DigitalCage() {
  return (
    <div style={{ width: 400, height: 400 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <CageScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

## Animation with useFrame

```tsx
import { useFrame } from '@react-three/fiber';

function CageScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((_, delta) => {
    if (prefersReducedMotion || !meshRef.current) return;
    meshRef.current.rotation.y += 0.2 * delta; // ~0.2 rad/s
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial wireframe color="white" transparent opacity={0.3} />
    </mesh>
  );
}
```

## State Transition (bait → reveal)

```tsx
const [isRevealed, setIsRevealed] = useState(false);

// MutationObserver on body.reveal-state
useEffect(() => {
  const observer = new MutationObserver(() => {
    if (document.body.classList.contains('reveal-state')) {
      setIsRevealed(true);
    }
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  // Check initial state
  if (document.body.classList.contains('reveal-state')) setIsRevealed(true);
  return () => observer.disconnect();
}, []);
```

**Bait state**: White/gray wireframe, slow rotation
**Reveal state**: Red wireframe, faster rotation, silhouette glitch (random position jitter)

## Performance Guidelines

- Target 60fps on mid-range devices
- Use `client:visible` in Astro — lazy-load the entire Canvas
- Keep geometry simple: wireframe box + flat silhouette shape
- Dispose of Three.js resources on unmount
- Use `useMemo` for geometries and shapes that don't change
- Limit draw calls — one cage mesh + one silhouette mesh is enough

## Reduced Motion

```tsx
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
```

When reduced motion is preferred: show static cage, no rotation, no glitch effects.
