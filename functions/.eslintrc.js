module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module",
    },
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
    ],
    plugins: [
        "@typescript-eslint",
        "import",
    ],
    rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        '@typescript-eslint/no-var-requires': 0,
        "@typescript-eslint/no-explicit-any": "off"
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'import/no-unresolved': 'off',
            },
        },
    ],
};
