import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom cybersecurity colors
				electric: {
					DEFAULT: 'hsl(var(--electric-blue))',
					glow: 'hsl(var(--electric-glow))'
				},
				cyber: 'hsl(var(--cyber-purple))',
				threat: {
					red: 'hsl(var(--threat-red))',
					green: 'hsl(var(--safe-green))',
					amber: 'hsl(var(--warning-amber))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Lightning and cyber animations
				'lightning-flash': {
					'0%, 90%, 100%': {
						opacity: '0',
						left: '-100%'
					},
					'5%, 10%': {
						opacity: '1',
						left: '100%'
					}
				},
				'bolt-strike': {
					'0%, 90%, 100%': {
						opacity: '0',
						transform: 'scaleY(0)'
					},
					'5%, 15%': {
						opacity: '1',
						transform: 'scaleY(1)'
					}
				},
				'wave-flow': {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(-1200px)'
					}
				},
				'pulse-electric': {
					'0%, 100%': {
						boxShadow: '0 0 30px hsl(var(--electric-blue) / 0.3)'
					},
					'50%': {
						boxShadow: '0 0 60px hsl(var(--electric-blue) / 0.6)'
					}
				},
				'cyber-scan': {
					'0%': {
						transform: 'translateX(-100%)',
						opacity: '0'
					},
					'50%': {
						opacity: '1'
					},
					'100%': {
						transform: 'translateX(100%)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'lightning-flash': 'lightning-flash 3s ease-in-out infinite',
				'bolt-strike': 'bolt-strike 2s ease-in-out infinite',
				'wave-flow': 'wave-flow 8s ease-in-out infinite',
				'pulse-electric': 'pulse-electric 2s ease-in-out infinite',
				'cyber-scan': 'cyber-scan 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
