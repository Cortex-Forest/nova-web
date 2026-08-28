import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nova 深色体系 —— 偏蓝黑的"宇宙深空"
        ink: {
          950: "#04060B",
          900: "#070A11",
          850: "#0A0E17",
          800: "#0D1320",
          700: "#141C2E",
          600: "#1C2740",
        },
        // 主强调色：青（primary），辅强调色：紫罗兰（secondary）
        nova: {
          cyan: "#22D3EE",
          cyanSoft: "#67E8F9",
          violet: "#A78BFA",
          violetSoft: "#C4B5FD",
          magenta: "#E879F9",
        },
        // 文字层级
        mist: {
          100: "#F2F6FB",
          200: "#DCE4F0",
          300: "#B9C5D8",
          400: "#8E9CB3",
          500: "#6B7A93",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      backgroundImage: {
        "nova-gradient":
          "linear-gradient(120deg, #22D3EE 0%, #67E8F9 30%, #A78BFA 70%, #E879F9 100%)",
        "nova-gradient-soft":
          "linear-gradient(120deg, rgba(34,211,238,0.16) 0%, rgba(167,139,250,0.16) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(34,211,238,0.45)",
        "glow-violet": "0 0 40px -12px rgba(167,139,250,0.45)",
        card: "0 12px 40px -12px rgba(0,0,0,0.6)",
      },
      // 补充默认色阶之外的透明度值（默认只含 5 的倍数，
      // 缺少 /8 /18 /98 会导致 border-white/8 等类不生成）
      opacity: {
        8: "0.08",
        18: "0.18",
        98: "0.98",
      },
      borderRadius: {
        "2.5xl": "1.25rem",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
