import type { Config } from "tailwindcss";
import formsPlugin from "@tailwindcss/forms";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-serif)", ...defaultTheme.fontFamily.serif],
      },
      keyframes: {
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        slideIn: {
          from: {
            transform: "translateX(calc(100% + var(--viewport-padding)))",
          },
          to: { transform: "translateX(0)" },
        },
        swipeOut: {
          from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          to: { transform: "translateX(calc(100% + var(--viewport-padding)))" },
        },

        slideDown: {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0px" },
        },
      },
      animation: {
        slideDown: "slideDown 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        hide: "hide 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        swipeOut: "swipeOut 100ms ease-out",
      },
    },
  },
  plugins: [
    formsPlugin,
    plugin(({ addUtilities }) => {
      addUtilities({
        ".bg-underline": {
          "background-image":
            "linear-gradient(to right, currentColor, currentColor)",
          "background-repeat": "no-repeat",
          "background-size": "0% 0.1em",
          "background-position": "bottom right",
          "transition-property": "background-size",
          "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
          "transition-duration": "250ms",
          "&:hover": {
            "background-size": "100% 0.1em",
            "background-position": "bottom left",
          },
        },
      });
    }),
  ],
};
export default config;
