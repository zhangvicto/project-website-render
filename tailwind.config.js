/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',             // ← enable class‑based dark mode :contentReference[oaicite:0]{index=0}
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
