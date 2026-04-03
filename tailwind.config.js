/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // AWS-inspired colors
                aws: {
                    navy: '#232f3e',
                    orange: '#ff9900',
                    squid: '#161e2d',
                },
                // Content area - light theme
                content: {
                    bg: '#ffffff',
                    surface: '#f8fafc',
                    border: '#e2e8f0',
                },
                // Text colors
                text: {
                    primary: '#1e293b',
                    secondary: '#475569',
                    muted: '#94a3b8',
                    inverse: '#f1f5f9',
                },
                // Accent colors
                accent: {
                    orange: '#ff9900',
                    blue: '#0073bb',
                    cyan: '#00a4b4',
                },
                // Admonition colors
                admonition: {
                    note: '#3b82f6',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    tip: '#10b981',
                },
            },
            fontFamily: {
                sans: ['Open Sans', 'system-ui', 'sans-serif'],
                heading: ['Ember', 'Open Sans', 'system-ui', 'sans-serif'],
                mono: ['Source Code Pro', 'Consolas', 'monospace'],
            },
            boxShadow: {
                'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
                'card-hover': '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: '#1e293b',
                        a: {
                            color: '#ff9900',
                            '&:hover': {
                                color: '#cc7a00',
                            },
                        },
                        code: {
                            backgroundColor: '#f1f5f9',
                            padding: '0.25rem 0.375rem',
                            borderRadius: '0.25rem',
                            fontWeight: '400',
                        },
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                    },
                },
            },
        },
    },
    plugins: [],
}
