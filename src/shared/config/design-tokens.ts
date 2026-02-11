/** Design tokens — mirrors tailwind.config.mjs for use in JS/TS */
export const colors = {
  darkBg: '#0a0a0a',
  darkCard: '#111111',
  darkSurface: '#1a1a1a',
  neonPink: '#ff2d87',
  electricBlue: '#00a2ff',
  revealGray: '#1a1a1a',
  revealRed: '#ff3333',
  bloodRed: '#cc0000',
  warningAmber: '#ff4500',
} as const;

export const fonts = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
} as const;
