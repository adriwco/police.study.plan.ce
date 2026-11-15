export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--text)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        paper: {
          DEFAULT: 'var(--bg)',
          surface: 'var(--surface)',
          subtle: 'var(--bg-subtle)',
        },
        line: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
        },
        ok: 'var(--ok)',
        warn: 'var(--warn)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      transitionTimingFunction: {
        cine: 'var(--ease-cine)',
      },
    },
  },
  plugins: [],
};
