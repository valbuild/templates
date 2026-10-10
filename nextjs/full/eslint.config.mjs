import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import valbuild from "@valbuild/eslint-plugin";

const eslintConfig = [
  // Build output. `.next` is ignored by Next's own config; Storybook's is not,
  // and a `pnpm run lint` after `pnpm run build-storybook` read its minified
  // bundles as source.
  { ignores: ["storybook-static"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  // @valbuild/eslint-plugin only ships a legacy (eslintrc) `recommended`
  // config, so register the plugin and its rules directly for flat config.
  {
    plugins: { "@valbuild": valbuild },
    rules: valbuild.configs.recommended.rules,
  },
];

export default eslintConfig;
