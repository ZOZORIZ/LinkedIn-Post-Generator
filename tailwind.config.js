/** @type {import('tailwindcss').Config} */

module.exports = {
	darkMode: ['class'],
	content: [
	  './pages/**/*.{js,ts,jsx,tsx,mdx}',
	  './components/**/*.{js,ts,jsx,tsx,mdx}',
	  './app/**/*.{js,ts,jsx,tsx,mdx}',
	  './styles/**/*.{css,scss}',
	],
	theme: {
	  extend: {
		animation: {
		  'border-horizontal': 'border-horizontal 2s linear infinite',
		  'border-horizontal-reverse': 'border-horizontal-reverse 2s linear infinite',
		  aurora: "aurora 60s linear infinite",
		},
		keyframes: {
		  aurora: {
			from: {
			  backgroundPosition: "50% 50%, 50% 50%",
			},
			to: {
			  backgroundPosition: "350% 50%, 350% 50%",
			},
		  },
		  'border-horizontal': {
			'0%': {
			  transform: 'translateX(-100%)'
			},
			'100%': {
			  transform: 'translateX(100%)'
			}
		  },
		  'border-horizontal-reverse': {
			'0%': {
			  transform: 'translateX(100%)'
			},
			'100%': {
			  transform: 'translateX(-100%)'
			}
		  },
		},
		borderRadius: {
		  lg: 'var(--radius)',
		  md: 'calc(var(--radius) - 2px)',
		  sm: 'calc(var(--radius) - 4px)'
		},
		colors: {
		  background: 'hsl(var(--background))',
		  foreground: 'hsl(var(--foreground))',
		  card: {
			DEFAULT: 'hsl(var(--card))',
			foreground: 'hsl(var(--card-foreground))'
		  },
		  popover: {
			DEFAULT: 'hsl(var(--popover))',
			foreground: 'hsl(var(--popover-foreground))'
		  },
		  primary: {
			DEFAULT: 'hsl(var(--primary))',
			foreground: 'hsl(var(--primary-foreground))'
		  },
		  secondary: {
			DEFAULT: 'hsl(var(--secondary))',
			foreground: 'hsl(var(--secondary-foreground))'
		  },
		  muted: {
			DEFAULT: 'hsl(var(--muted))',
			foreground: 'hsl(var(--muted-foreground))'
		  },
		  accent: {
			DEFAULT: 'hsl(var(--accent))',
			foreground: 'hsl(var(--accent-foreground))'
		  },
		  destructive: {
			DEFAULT: 'hsl(var(--destructive))',
			foreground: 'hsl(var(--destructive-foreground))'
		  },
		  border: 'hsl(var(--border))',
		  input: 'hsl(var(--input))',
		  ring: 'hsl(var(--ring))',
		  chart: {
			'1': 'hsl(var(--chart-1))',
			'2': 'hsl(var(--chart-2))',
			'3': 'hsl(var(--chart-3))',
			'4': 'hsl(var(--chart-4))',
			'5': 'hsl(var(--chart-5))'
		  }
		}
	  }
	},
	plugins: [require("tailwindcss-animate")],
	corePlugins: {
	  preflight: true,
	},
  }
  