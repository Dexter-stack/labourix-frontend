/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // CSS-variable driven colors — resolved at runtime per theme
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        surface2: 'var(--surface2)',
        border:   'var(--border)',
        border2:  'var(--border2)',
        tx:       'var(--text)',
        tx2:      'var(--text2)',
        tx3:      'var(--text3)',
        accent:   'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
        // Semantic palette
        teal:   'oklch(0.74 0.14 185)',
        green:  'oklch(0.72 0.16 145)',
        purple: 'oklch(0.72 0.15 280)',
        amber:  'oklch(0.78 0.15 72)',
        danger: 'oklch(0.65 0.2 25)',
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4)',
        glow: '0 0 16px var(--accent-dim)',
      },
    },
  },
  plugins: [],
}
