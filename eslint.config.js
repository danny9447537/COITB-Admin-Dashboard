import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
    { ignores: ["dist"] },
    js.configs.recommended, // this replaces "eslint:recommended"
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module"
            }
        },
        plugins: {
            react: react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh
        },
        rules: {
            ...react.configs.recommended.rules, // this replaces "plugin:react/recommended"
            ...reactHooks.configs.recommended.rules,
            "react/prop-types": "off",
            "react/no-unescaped-entities": "off",
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }]
        }
    }
];
