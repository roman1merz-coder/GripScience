import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        grip: {
          50: '#f0f7f4',
          100: '#d9ebe2',
          200: '#b5d7c7',
          300: '#89bda6',
          400: '#5f9d82',
          500: '#1B4D3E',
          600: '#173f33',
          700: '#133229',
          800: '#0f261f',
          900: '#0a1915',
        },
        rock: {
          limestone: '#E8E4D9',
          granite: '#9CA3AF',
          sandstone: '#D4A574',
        },
      },
    },
  },
  plugins: [],
};

export default config;
