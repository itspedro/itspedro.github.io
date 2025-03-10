/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "#B2B2B2",
            h1: {
              color: "#F6F6F6",
            },
            a: {
              color: "#FFFFFF",
            },
            strong: {
              color: "#FFFFFF",
            },
          },
        },
      },
    },
  },
  plugins: [],
};
