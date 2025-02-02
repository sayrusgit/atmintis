import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      spacing: {
        xs: '0.625rem',
        sm: '1.25rem',
        md: '1.5rem',
        lg: '1.9rem',
        xl: '3rem',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: {
          DEFAULT: 'hsl(var(--foreground))',
          heading: 'hsl(var(--foreground-heading))',
        },
        hover: 'hsl(var(--hover))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          hover: 'hsl(var(--card-hover))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
          hover: 'hsl(var(--popover-hover))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          hover: 'hsl(var(--accent-hover))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          foreground: 'hsl(var(--danger-foreground))',
        },
        link: 'hsl(var(--link))',
        border: {
          DEFAULT: 'hsl(var(--border))',
          hover: 'hsl(var(--border-hover))',
        },
        input: {
          DEFAULT: 'hsl(var(--input))',
          border: 'hsl(var(--input-border))',
        },
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        reddish: 'hsl(var(--reddish))',
        greenish: 'hsl(var(--greenish))',
        bluish: 'hsl(var(--blueish))',
      },
      borderRadius: {
        xl: 'var(--radius)',
        md: 'calc(var(--radius) - 6px)',
        sm: 'calc(var(--radius) - 8px)',
        xs: 'calc(var(--radius) - 9px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
