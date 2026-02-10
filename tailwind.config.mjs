/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0a',
        'dark-card': '#111111',
        'dark-surface': '#1a1a1a',
        'neon-pink': '#ff2d87',
        'neon-pink-dim': '#cc2470',
        'electric-blue': '#00a2ff',
        'reveal-gray': '#1a1a1a',
        'reveal-red': '#ff3333',
        'blood-red': '#cc0000',
        'deep-crimson': '#8b0000',
        'warning-amber': '#ff4500',
        'toxic-green': '#00ff41',
        'bruise-purple': '#6b21a8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'typing': 'typing 1.5s steps(3) infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
        },
      },
    },
  },
  plugins: [],
};
