/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Worldline Primary Teal/Turquoise
        primary: {
          50: '#E8F7F7',
          100: '#C7ECEB',
          200: '#A3E0DF',
          300: '#7ED4D3',
          400: '#62CBC9',
          500: '#5BC0BE', // Main Worldline Teal
          600: '#4AADAB',
          700: '#3A9B99',
          800: '#2C7A78',
          900: '#1F5958',
        },
        // Worldline Secondary/Accent (Darker Teal)
        accent: {
          50: '#E6F2F2',
          100: '#BFDEDE',
          200: '#99CACA',
          300: '#73B6B6',
          400: '#56A7A7',
          500: '#3A9B99', // Dark Teal
          600: '#338B89',
          700: '#2A7775',
          800: '#226361',
          900: '#194A48',
        },
        // Worldline Success Green
        success: {
          50: '#E8F6F2',
          100: '#C5E9DD',
          200: '#9FDBC7',
          300: '#78CDB1',
          400: '#5BC3A0',
          500: '#52C5A7',
          600: '#42A98A',
          700: '#358B70',
          800: '#296D57',
          900: '#1D4F3F',
        },
        // Worldline Warning
        warning: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },
        // Worldline Error/Reject
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}