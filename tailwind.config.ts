import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Superficies claras (tema amigable); acentos azules
        ink: {
          950: '#eef4fc',
          900: '#ffffff',
          850: '#f6faff',
          800: '#e6eefb',
          700: '#d3e2f8',
        },
        accent: {
          DEFAULT: '#0ea5e9',
          cyan: '#38bdf8',
          violet: '#818cf8',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(14, 165, 233, 0.45)',
        'glow-cyan': '0 0 40px -10px rgba(56, 189, 248, 0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out both',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
