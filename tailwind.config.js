/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#f7f9fc',
          dim: '#d8dadd',
          bright: '#f7f9fc',
          lowest: '#ffffff',
          low: '#f2f4f7',
          container: '#eceef1',
          high: '#e6e8eb',
          highest: '#e0e3e6',
        },
        'on-surface': '#191c1e',
        'on-surface-variant': '#43474e',
        outline: '#74777f',
        'outline-variant': '#c4c6cf',
        brand: {
          primary: '#1F3A5F',       // Deep Navy Blue
          'primary-hover': '#162A45',
          'primary-container': '#1f3a5f',
          'on-primary': '#ffffff',
          secondary: '#1B7F79',     // Teal Green
          'secondary-hover': '#156560',
          'secondary-light': '#CCFBF1',
          'secondary-dark': '#115E59',
          tertiary: '#142538',
        },
        civic: {
          pending: {
            bg: '#FEF3C7',
            border: '#F59E0B',
            text: '#B45309'
          },
          process: {
            bg: '#CCFBF1',
            border: '#1B7F79',
            text: '#115E59'
          },
          success: {
            bg: '#D1FAE5',
            border: '#10B981',
            text: '#047857'
          },
          rejected: {
            bg: '#FEE2E2',
            border: '#EF4444',
            text: '#B91C1C'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      },
      boxShadow: {
        'level-1': '0 1px 3px rgba(30, 41, 59, 0.04), 0 1px 2px rgba(30, 41, 59, 0.02)',
        'level-2': '0 4px 6px -1px rgba(30, 41, 59, 0.07), 0 2px 4px -2px rgba(30, 41, 59, 0.05)',
        'level-3': '0 20px 25px -5px rgba(30, 41, 59, 0.1), 0 8px 10px -6px rgba(30, 41, 59, 0.04)',
      }
    },
  },
  plugins: [],
}
