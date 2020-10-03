module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: [
    "airbnb-typescript",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  plugins: ["react-hooks"],
  rules: {
    "no-undef": 0,
    "react/prop-types": 0,
    "react/style-prop-object": 0,
    "react/jsx-props-no-spreading": 0,
    // Recommended for immer.
    "no-param-reassign": [
      "error",
      { props: true, ignorePropertyModificationsFor: ["draft"] },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "webpack.config.prod.js",
          "webpack.config.js",
          "**/*stories.tsx",
          "**/*.spec.js",
          "**/*.spec.ts",
        ],
      },
    ],
    "import/no-named-as-default": "off",
    "import/extensions": "off",
    "import/prefer-default-export": 0,
    "react/jsx-fragments": "off",
  },
  globals: {
    document: true,
    window: true,
  },
  ignorePatterns: [".eslintrc.js"]
}
