import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090a",
        foreground: "#f4f3ef",
        muted: "#a7a29a",
        line: "rgba(244,243,239,0.12)",
        ink: "#141414",
        brass: "#c7a86b",
        clay: "#a85f45",
        moss: "#6f7d62",
        steel: "#7c95a6"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(199,168,107,.22), 0 24px 80px rgba(0,0,0,.35)"
      }
    }
  },
  plugins: []
};

export default config;
