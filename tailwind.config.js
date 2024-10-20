/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#036988",
        secondary: "#ff7e01",
        white: {
          DEFAULT: "#f9f8fa",
          50: "#ffffff",
          100: "#f9f9f9",
          200: "#f3f3f3",
          300: "#eeeeee",
          400: "#e0e0e0",
          500: "#d6d6d6",
          600: "#cccccc",
          700: "#b3b3b3",
          800: "#999999",
          900: "#808080",
        },
        gray: {
            DEFAULT: "#727273",
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
        },
      },
    },
  },
  plugins: [],
};
