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
        'electric-blue': '#00a2ff',
        'reveal-gray': '#1a1a1a',
        'reveal-red': '#ff3333',
        'blood-red': '#cc0000',
        'warning-amber': '#ff4500',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 1.5s steps(3) infinite',
      },
    },
  },
  plugins: [],
};
