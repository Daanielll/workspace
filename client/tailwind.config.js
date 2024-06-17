export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "washed-blue": "#D1D9E6",
        "washed-blue-600": "#BEC5D1",
        "washed-blue-700": "#949AA3",
        "washed-blue-800": "#73777F",
        "washed-blue-900": "#585B61",
        dark: "#101112",
        "lighter-dark": "#131416",
        "primary-grey": "#646E78",
        "primary-grey-700": "#474E55",
        "primary-blue": "#4A93FF",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
};
