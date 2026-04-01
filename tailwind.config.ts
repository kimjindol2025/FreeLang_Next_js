import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Fira Code", "monospace", ...defaultTheme.fontFamily.sans],
        mono: ["Fira Code", "monospace"],
      },

      colors: {
        // VS Code 다크 테마 색상
        editor: {
          bg: "#1e1e1e",
          fg: "#d4d4d4",
          border: "#3e3e42",
          selection: "#264f78",
          lineNumber: "#858585",
          gutterBg: "#1e1e1e",
        },
        // FreeLang 문법 강조색
        syntax: {
          keyword: "#569cd6",
          string: "#ce9178",
          number: "#b5cea8",
          comment: "#6a9955",
          function: "#dcdcaa",
          type: "#4ec9b0",
          error: "#f48771",
        },
        // UI 상태
        state: {
          success: "#4ec9b0",
          error: "#f48771",
          warning: "#dcdcaa",
          info: "#569cd6",
        },
      },

      backgroundColor: {
        "dark-primary": "#1e1e1e",
        "dark-secondary": "#252526",
        "dark-tertiary": "#2d2d30",
      },

      textColor: {
        "dark-primary": "#d4d4d4",
        "dark-secondary": "#858585",
        "dark-tertiary": "#6a9955",
      },

      borderColor: {
        "dark-border": "#3e3e42",
      },

      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },

  plugins: [],
};

export default config;
