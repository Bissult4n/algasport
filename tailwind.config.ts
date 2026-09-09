import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#090909",
        charcoal: "#111213",
        panel: "#161718",
        vermilion: "#9e1c18",
        ember: "#cc312a",
        rice: "#eee8df"
      },
      fontFamily: {
        display: ["Arial Narrow", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Times New Roman", "Noto Serif JP", "serif"]
      },
      letterSpacing: {
        seal: "0.28em",
        wide: "0.18em"
      },
      animation: {
        drift: "drift 10s ease-in-out infinite",
        pulseSeal: "pulseSeal 2.4s ease-in-out infinite",
        petal: "petal 12s linear infinite",
        marquee: "marquee 24s linear infinite"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1.02)" },
          "50%": { transform: "translate3d(0, -1.2%, 0) scale(1.045)" }
        },
        pulseSeal: {
          "0%, 100%": { opacity: "0.72", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.07)" }
        },
        petal: {
          "0%": { transform: "translate3d(0, -12vh, 0) rotate(10deg)", opacity: "0" },
          "8%": { opacity: "0.48" },
          "100%": { transform: "translate3d(-42px, 106vh, 0) rotate(320deg)", opacity: "0" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
