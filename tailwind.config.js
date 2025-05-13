/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        secondary: "var(--secondary)",
        stroke: "#E2E8F0",
        strokedark: "#2E3A47",
        boxdark: {
          DEFAULT: "#24303F",
          2: "#1A222C",
        },
        'meta-1': "#DC3545",
        'meta-2': "#EFF2F7",
        'meta-3': "#10B981",
        'meta-4': "#313D4A",
        'meta-5': "#259AE6",
        'meta-6': "#FFBA00",
        'meta-7': "#FF6766",
        'meta-8': "#F0950C",
        'meta-9': "#E5E7EB",
        success: "#219653",
        danger: "#D34053",
        warning: "#FFA70B",
        bodydark: {
          DEFAULT: "#AEB7C0",
          1: "#DEE4EE",
          2: "#8A99AF"
        },
      },
      spacing: {
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
        10.5: '2.625rem',
      },
      fontSize: {
        'title-xxl': ['44px', '55px'],
        'title-xl': ['36px', '45px'],
        'title-xl2': ['33px', '45px'],
        'title-lg': ['28px', '35px'],
        'title-md': ['24px', '30px'],
        'title-md2': ['26px', '30px'],
        'title-sm': ['20px', '26px'],
        'title-xsm': ['18px', '24px'],
      },
      screens: {
        '2xsm': '375px',
        xsm: '425px',
        '3xl': '2000px',
        '4xl': '2300px',
      },
      boxShadow: {
        1: '0px 1px 3px 0px rgba(166, 175, 195, 0.40)',
        2: '0px 5px 12px 0px rgba(0, 0, 0, 0.10)',
        3: '0px 5px 12px 0px rgba(0, 0, 0, 0.03)',
        4: '0px 5px 12px 0px rgba(0, 0, 0, 0.05)',
        5: '0px 5px 15px 0px rgba(0, 0, 0, 0.05)',
        6: '0px 6px 20px 0px rgba(0, 0, 0, 0.05)',
        7: '0px 4px 15px 0px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};