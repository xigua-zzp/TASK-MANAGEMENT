/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        page: '#121212',
        'card-bg': '#1E1E1E',
        'progress-track': '#333333',
        'progress-fill': '#FFD700',
        'task-count': '#888888',
        'update-time': '#666666',
        'status-active': '#10B981',
        brown: {
          300: '#8D6E63',
          400: '#795548',
          500: '#6D4C41',
          600: '#5D4037',
          700: '#4E342E',
          800: '#3E2723',
          900: '#3E2723',
        },
        status: {
          'on-track': '#10B981',
          'at-risk': '#FF9800',
        },
        // Shadcn/ui colors
        background: '#121212',
        foreground: '#FFFFFF',
        card: '#1E1E1E',
        'card-foreground': '#FFFFFF',
        popover: '#1E1E1E',
        'popover-foreground': '#FFFFFF',
        primary: '#D4AF37',
        'primary-foreground': '#000000',
        secondary: '#2A2A2A',
        'secondary-foreground': '#FFFFFF',
        muted: '#2A2A2A',
        'muted-foreground': '#888888',
        accent: '#2A2A2A',
        'accent-foreground': '#FFFFFF',
        destructive: '#EF4444',
        'destructive-foreground': '#FFFFFF',
        border: '#333333',
        input: '#333333',
        ring: '#D4AF37',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "fade-out": {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        "zoom-in": {
          from: { opacity: 0, transform: "translate(-50%, -50%) scale(0.95)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
        "zoom-out": {
          from: { opacity: 1, transform: "translate(-50%, -50%) scale(0.95)" },
          to: { opacity: 0, transform: "translate(-50%, -50%) scale(0.95)" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "zoom-in": "zoom-in 0.2s ease-out",
        "zoom-out": "zoom-out 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.2s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.2s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
