import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── TYPOGRAPHY ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ['var(--font)', 'Roboto', 'sans-serif'],
        alt: ['var(--font-alt)', 'Montserrat', 'sans-serif'],
        mono: ['var(--font-monospace)', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'rem-70': ['0.7rem', { lineHeight: '1.5' }],     // 9.8px
        'rem-75': ['0.75rem', { lineHeight: '1.5' }],    // 10.5px
        'rem-80': ['0.8rem', { lineHeight: '1.5' }],     // 11.2px
        'rem-85': ['0.85rem', { lineHeight: '1.5' }],    // 11.9px
        'rem-90': ['0.9rem', { lineHeight: '1.5' }],     // 12.6px
        'rem-95': ['0.95rem', { lineHeight: '1.5' }],    // 13.3px
        'rem-100': ['1rem', { lineHeight: '1.5' }],      // 14px — base
        'rem-110': ['1.1rem', { lineHeight: '1.4' }],    // 15.4px
        'rem-120': ['1.2rem', { lineHeight: '1.4' }],    // 16.8px
        'rem-130': ['1.3rem', { lineHeight: '1.4' }],    // 18.2px
        'rem-140': ['1.4rem', { lineHeight: '1.3' }],    // 19.6px
        'rem-150': ['1.5rem', { lineHeight: '1.3' }],    // 21px
        'rem-160': ['1.6rem', { lineHeight: '1.3' }],    // 22.4px
        'rem-170': ['1.7rem', { lineHeight: '1.2' }],    // 23.8px
        'rem-180': ['1.8rem', { lineHeight: '1.2' }],    // 25.2px
        'rem-190': ['1.9rem', { lineHeight: '1.2' }],    // 26.6px
        'rem-200': ['2rem', { lineHeight: '1.2' }],      // 28px
      },
      fontWeight: {
        thin: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },

      // ─── COLOR TOKENS ─────────────────────────────────────────────────────
      colors: {
        // Primary orange brand (scale 50–950)
        primary: {
          DEFAULT: '#EF7E48',
          50: '#FFF6F0',
          100: '#FCE8D8',
          200: '#F9CEAF',
          300: '#F4AB7D',
          400: '#EF7E48',
          500: '#EF7E48',
          600: '#DC4319',
          700: '#B73218',
          800: '#93291A',
          900: '#752419',
          950: '#3F0E0C',
          foreground: 'hsl(var(--primary-foreground))',
        },

        // Brand red (kazee)
        brand: {
          DEFAULT: '#D9292F',
        },

        // Dark navy text (#283252)
        'dark-text': {
          DEFAULT: '#283252',
        },

        // Light text (#A2A5B9)
        'light-text': {
          DEFAULT: '#A2A5B9',
        },

        // Executive dashboard gold accent (#ffcd29 / #fed400 / #f59e0b)
        gold: {
          DEFAULT: '#fed400',
          50: '#fffef0',
          100: '#fff9d1',
          200: '#fff3a3',
          300: '#ffeb75',
          400: '#ffe347',
          500: '#fed400',
          600: '#f59e0b',
          700: '#e6a800',
          800: '#c48f00',
          900: '#a9770a',
        },

        // Sentiment: positive
        pos: {
          DEFAULT: '#3EC764',
          light: '#d8f3e0',
        },

        // Sentiment: negative
        neg: {
          DEFAULT: '#ED3E3E',
          light: '#fbd8d8',
        },

        // Grey / neutral scale
        grey: {
          50: '#FCFCFC',
          100: '#F5F5F5',
          200: '#f0f0f0',
          300: '#eee',
          400: '#e8e8e8',
          500: '#ddd',
          600: '#dbdbdb',
          650: '#b5b5b5',
          700: '#999',
          750: '#666',
          800: '#595959',
          900: '#363636',
        },

        // Semantic HSL-based colors (from SCSS variables)
        secondary: {
          DEFAULT: 'hsl(222, 82%, 56%)',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        info: {
          DEFAULT: 'hsl(200, 97%, 45%)',
          foreground: 'hsl(var(--info-foreground))',
        },
        success: {
          DEFAULT: 'hsl(164, 95%, 43%)',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(35, 95%, 62%)',
          foreground: 'hsl(var(--warning-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(341, 79%, 53%)',
          foreground: 'hsl(var(--danger-foreground))',
        },
        purple: {
          DEFAULT: 'hsl(261, 32%, 55%)',
        },
        blue: {
          DEFAULT: 'hsl(198, 100%, 61%)',
        },
        red: {
          DEFAULT: 'hsl(345, 94%, 57%)',
        },
        orange: {
          DEFAULT: 'hsl(19, 100%, 75%)',
        },
        yellow: {
          DEFAULT: 'hsl(43, 100%, 72%)',
        },
        green: {
          DEFAULT: 'hsl(113, 59%, 71%)',
        },
        pink: {
          DEFAULT: 'hsl(344, 100%, 81%)',
        },

        // Shadcn CSS variable colors (JANGAN DIHAPUS)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },

      // ─── BORDER RADIUS ────────────────────────────────────────────────────
      borderRadius: {
        sm: 'var(--radius-small, 2px)',
        DEFAULT: 'var(--radius, 4px)',
        md: 'var(--radius-large, 6px)',
        lg: 'var(--radius, 4px)',
        xl: '8px',
        '2xl': '10px',
        full: 'var(--radius-rounded, 9999px)',
      },

      // ─── BOX SHADOW ───────────────────────────────────────────────────────
      boxShadow: {
        card: '-1px 3px 10px 0 rgba(0, 0, 0, 0.06)',
        'card-md': '-1px 3px 10px 0 rgba(0, 0, 0, 0.12)',
        'btn-hover': '0 2px 8px rgba(255, 138, 0, 0.2)',
        'filter-sheet': '0 -8px 24px rgba(0, 0, 0, 0.12)',
      },

      // ─── SPACING ──────────────────────────────────────────────────────────
      spacing: {
        'pd-5': '5px',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
