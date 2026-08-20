import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#723ECF',       // Purple Heart (8%)
        accent: '#ED4B86',        // French Rose (2%)
        surface: '#F4EEF7',       // Whisper (60%)
        secondary: '#FEF8E7',     // Off Yellow (30%)
        obsidian: '#171024',      // Obsidian Telemetry
        borderEditorial: '#E0D3E8',
        borderOffYellow: '#EADBBE',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
