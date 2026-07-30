// @ts-check
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "data/**", "coverage/**"],
  },
  ...tseslint.configs.recommended,
  {
    plugins: { security },
    rules: {
      ...security.configs.recommended.rules,
      // Manutenibilidade (ISO/IEC 25010): guard-rails de complexidade, não achados —
      // a lógica de negócio atual é propositalmente simples.
      complexity: ["error", 10],
      "max-depth": ["error", 4],
      "max-params": ["error", 4],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["tests/**/*.ts"],
    rules: {
      "security/detect-object-injection": "off",
      "security/detect-non-literal-fs-filename": "off",
    },
  },
);
