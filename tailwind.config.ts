import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "fade-out": "1s fadeOut 3s ease-out forwards",
        "ping": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "ping-delay-1": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s",
        "ping-delay-2": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 1s",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
