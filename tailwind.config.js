import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Chessverse brand palette — theme-aware. Values live in index.css (:root = dark,
        // .light = porcelain & ink), so every utility, opacity modifier and gradient follows the theme.
        void: "rgb(var(--c-void) / <alpha-value>)",         // page background
        twilight: "rgb(var(--c-twilight) / <alpha-value>)", // card surface
        midnight: "rgb(var(--c-midnight) / <alpha-value>)", // raised / tinted surface
        royal: "rgb(var(--c-royal) / <alpha-value>)",       // deep brand blue
        sky: "rgb(var(--c-sky) / <alpha-value>)",           // primary brand blue
        azure: "rgb(var(--c-azure) / <alpha-value>)",       // highlight blue
        gold: "rgb(var(--c-gold) / <alpha-value>)",         // gold accent
        ivory: "rgb(var(--c-ivory) / <alpha-value>)",       // primary text (ivory on dark, ink on light)
        ghost: "rgb(var(--c-ghost) / <alpha-value>)",       // muted text
        glass: "rgb(var(--c-twilight) / 0.5)",
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        glow: "0 0 24px rgba(58, 141, 222, 0.35)",
        "glow-lg": "0 0 56px rgba(58, 141, 222, 0.45)",
        "glow-gold": "0 0 28px rgba(212, 175, 55, 0.35)",
      },
      backgroundImage: {
        "chess-pattern":
          "linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%), linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%)",
        "radial-fade":
          "radial-gradient(ellipse at top, rgba(58,141,222,0.18) 0%, transparent 60%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(2deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.55)" },
          "70%": { boxShadow: "0 0 0 20px rgba(37, 211, 102, 0)" },
        },
        "pulse-blue": {
          "0%, 100%": { boxShadow: "0 0 24px rgba(58, 141, 222, 0.25)" },
          "50%": { boxShadow: "0 0 48px rgba(58, 141, 222, 0.55)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s infinite",
        "pulse-blue": "pulse-blue 3s ease-in-out infinite",
        "marquee": "marquee 35s linear infinite",
        "shimmer": "shimmer 3s linear infinite",
        "spin-slow": "spin-slow 25s linear infinite",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // `light:` variant — the theme toggle puts `.light` on <html>
    ({ addVariant }) => addVariant('light', '.light &'),
  ],
}
