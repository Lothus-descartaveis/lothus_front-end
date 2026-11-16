/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lothus: {
          navy: '#041B38',
          'navy-dark': '#121A2B',
          'navy-medium': '#243656',
          primary: '#2A487A',
          'primary-light': '#325997',
          'primary-tint': '#E7EDF7',
          royal: '#1863DC',
          'royal-dark': '#0E4A7D',
          orange: '#FB8C00',
          'orange-light': '#F5A12A',
          'orange-amber': '#F49820',
          green: '#16A34A',
          'green-light': '#2DB742',
          'green-tint': '#DCFCE7',
          surface: '#FFFFFF',
          'surface-subtle': '#F8FAFC',
          'surface-gray': '#F4F6FB',
          border: '#E2E8F0',
          'border-light': '#CAD7ED',
          'border-dark': '#CBD5E1',
          text: '#041B38',
          'text-muted': '#585858',
          'text-slate': '#64748B'
        }
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 12px 0 rgba(4, 27, 56, 0.06)',
        'card-hover': '0 10px 25px -3px rgba(4, 27, 56, 0.12)',
      }
    },
  },
  plugins: [],
}
