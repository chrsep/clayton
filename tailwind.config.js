module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["**/*.tsx"],
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
