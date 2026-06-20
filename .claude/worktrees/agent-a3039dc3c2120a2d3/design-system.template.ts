/**
 * DESIGN SYSTEM TEMPLATE — tailwind.config.ts
 *
 * Instruksi untuk AI:
 * Isi semua placeholder yang ditandai [FILL: ...] sesuai design system yang diminta.
 * Jangan ubah struktur, key, atau plugin yang sudah ada.
 * Setelah diisi, salin seluruh isi file ini ke: tailwind.config.ts
 */

import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {

      // ─── TYPOGRAPHY ───────────────────────────────────────────────────────────
      // Font dari SCSS design system: Roboto (sans), Montserrat (alt), Fira Code (mono)
      fontFamily: {
        sans:  ['var(--font)', 'Roboto', 'sans-serif'],
        alt:   ['var(--font-alt)', 'Montserrat', 'sans-serif'],
        mono:  ['var(--font-monospace)', 'Fira Code', 'monospace'],
      },

      // Font size scale berdasarkan SCSS rem classes (base: 14px = 1rem)
      fontSize: {
        'rem-70':  ['0.7rem',  { lineHeight: '1.5' }],   // 9.8px
        'rem-75':  ['0.75rem', { lineHeight: '1.5' }],   // 10.5px
        'rem-80':  ['0.8rem',  { lineHeight: '1.5' }],   // 11.2px
        'rem-85':  ['0.85rem', { lineHeight: '1.5' }],   // 11.9px
        'rem-90':  ['0.9rem',  { lineHeight: '1.5' }],   // 12.6px
        'rem-95':  ['0.95rem', { lineHeight: '1.5' }],   // 13.3px
        'rem-100': ['1rem',    { lineHeight: '1.5' }],   // 14px — base
        'rem-110': ['1.1rem',  { lineHeight: '1.4' }],   // 15.4px
        'rem-120': ['1.2rem',  { lineHeight: '1.4' }],   // 16.8px
        'rem-130': ['1.3rem',  { lineHeight: '1.4' }],   // 18.2px
        'rem-140': ['1.4rem',  { lineHeight: '1.3' }],   // 19.6px
        'rem-150': ['1.5rem',  { lineHeight: '1.3' }],   // 21px
        'rem-160': ['1.6rem',  { lineHeight: '1.3' }],   // 22.4px
        'rem-170': ['1.7rem',  { lineHeight: '1.2' }],   // 23.8px
        'rem-180': ['1.8rem',  { lineHeight: '1.2' }],   // 25.2px
        'rem-190': ['1.9rem',  { lineHeight: '1.2' }],   // 26.6px
        'rem-200': ['2rem',    { lineHeight: '1.2' }],   // 28px
      },

      // Font weight scale dari SCSS helpers
      fontWeight: {
        thin:      '300',
        normal:    '400',
        medium:    '500',
        semibold:  '600',
        bold:      '700',
        extrabold: '800',
        black:     '900',
      },

      // ─── COLOR TOKENS ─────────────────────────────────────────────────────────
      // Berdasarkan SCSS design system yang digunakan di dashboard eksekutif.
      // Setiap token punya skala 50–950 sesuai CSS variable yang ada.
      colors: {
        // Primary orange brand (dari SCSS --primary-50 s.d. --primary-950)
        primary: {
          DEFAULT: '#EF7E48',
          50:  '#FFF6F0',
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
        },

        // Brand red (kazee) — #D9292F
        brand: {
          DEFAULT: '#D9292F',
        },

        // Gold accent (executive dashboard: tab active, filter, report btn)
        gold: {
          DEFAULT: '#fed400',
          50:  '#fffef0',
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

        // Dark navy text (#283252)
        'dark-text': {
          DEFAULT: '#283252',
        },

        // Light text (#A2A5B9)
        'light-text': {
          DEFAULT: '#A2A5B9',
        },

        // Sentiment positive
        pos: {
          DEFAULT: '#3EC764',
          light: '#d8f3e0',
        },

        // Sentiment negative
        neg: {
          DEFAULT: '#ED3E3E',
          light: '#fbd8d8',
        },

        // Grey / neutral scale
        grey: {
          50:  '#FCFCFC',
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

        // ── Warna Semantic Shadcn (JANGAN HAPUS — harus tetap ada) ───────────
        // Diisi otomatis via CSS variable di globals.css, tidak perlu diubah di sini.
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },

      // ─── BORDER RADIUS ────────────────────────────────────────────────────────
      // --radius di globals.css mengontrol nilai dasarnya.
      // sm/md/lg dihitung relatif dari --radius, tidak perlu diubah.
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // [FILL: tambah skala lain jika perlu, misal: xl: 'calc(var(--radius) + 4px)']
        xl:  '8px',
        '2xl': '10px',
        full: '9999px',
      },

      // ─── SPACING ──────────────────────────────────────────────────────────────
      // [FILL: opsional — hanya isi jika ada nilai spacing non-standar]
      spacing: {
        'pd-5': '5px',
      },

      // ─── BOX SHADOW ───────────────────────────────────────────────────────────
      // Shadow dari SCSS design system
      boxShadow: {
        card:         '-1px 3px 10px 0 rgba(0,0,0,0.06)',
        'card-md':    '-1px 3px 10px 0 rgba(0,0,0,0.12)',
        'btn-hover':  '0 2px 8px rgba(255,138,0,0.2)',
        'filter-sheet': '0 -8px 24px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
