module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'tech-dark': '#0a0a16',
        'tech-blue': '#3b82f6',
        'tech-purple': '#8b5cf6',
        'tech-indigo': '#6366f1',
        'gray-750': '#2d3748',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
