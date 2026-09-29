// Le lint du site, en configuration « plate ».
//
// `next lint` a disparu avec Next 16, et ESLint 10 ne lit plus `.eslintrc.json` : depuis,
// `npm run lint` échouait sans rien contrôler. Ce fichier reprend exactement les deux jeux de
// règles de l'ancien `.eslintrc.json` (`next/core-web-vitals` + `next/typescript`), sous la
// forme que décrit `node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md`.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Les exclusions par défaut d'eslint-config-next, reprises ici puisque `globalIgnores`
  // les remplace.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
