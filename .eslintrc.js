module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json"
  },
  extends: [
    "airbnb-typescript",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/react"
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
      { props: true, ignorePropertyModificationsFor: ["draft"] }
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "webpack.config.prod.js",
          "webpack.config.js",
          "**/*stories.tsx",
          "**/*.spec.js",
          "**/*.spec.ts"
        ]
      }
    ],
    "import/no-named-as-default": "off",
    "import/extensions": "off",
    "import/prefer-default-export": 0,
    "react/jsx-fragments": "off",
    // not required anymore on next and react 17
    "react/react-in-jsx-scope": "off",
    // disable no-use-before-define between react components
    "no-use-before-define": [0],
    "@typescript-eslint/no-use-before-define": ["error", { "variables": false }],
    // Next js usually needs to use "a" without href
    "jsx-a11y/anchor-is-valid": 0
  },
  globals: {
    document: true,
    window: true
  },
  ignorePatterns: [".eslintrc.js"]
}
