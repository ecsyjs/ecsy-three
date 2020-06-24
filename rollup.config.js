import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import * as pkg from "./package.json";
const { execSync } = require("child_process");

var deps = {};
Object.keys(pkg.peerDependencies).forEach(dep => {
  deps[dep] = execSync(`npm info ${dep} version`)
    .toString()
    .trim();
});

export default [
  // Core
  {
    input: "index.js",
    external: ["three", "ecsy"],
    plugins: [json({ exclude: ["node_modules/**"] })],
    output: [
      // UMD externals are loaded from globals
      {
        format: "umd",
        file: "build/ecsy-three.js",
        name: "ECSYTHREE",
        noConflict: true,
        indent: "\t",
        globals: {
          three: "THREE",
          ecsy: "ECSY"
        }
      },
      {
        format: "umd",
        file: "build/ecsy-three.min.js",
        name: "ECSYTHREE",
        noConflict: true,
        indent: "\t",
        globals: {
          three: "THREE",
          ecsy: "ECSY"
        },
        sourcemap: true,
        plugins: [terser()]
      },

      // ESModule externals are loaded from unpkg
      {
        format: "es",
        file: "build/ecsy-three.module.js",
        indent: "\t",
        paths: {
          three: `https://unpkg.com/three@${deps["three"]}/build/three.module.js`,
          ecsy: `https://unpkg.com/ecsy@${deps["ecsy"]}/build/ecsy.module.js`
        }
      },
      {
        format: "es",
        file: "build/ecsy-three.module.min.js",
        indent: "\t",
        paths: {
          three: `https://unpkg.com/three@${deps["three"]}/build/three.module.js`,
          ecsy: `https://unpkg.com/ecsy@${deps["ecsy"]}/build/ecsy.module.js`
        },
        sourcemap: true,
        plugins: [terser()]
      }
    ]
  },

  // All
  {
    input: "all.js",
    plugins: [json(), resolve()],
    output: [
      {
        format: "es",
        file: "build/ecsy-three-all.module.js",
        indent: "\t"
      },
      {
        format: "es",
        file: "build/ecsy-three-all.module.min.js",
        indent: "\t",
        sourcemap: true,
        plugins: [terser()]
      },
      {
        format: "umd",
        name: "ECSYTHREE",
        noConflict: true,
        file: "build/ecsy-three-all.js",
        indent: "\t"
      },
      {
        format: "umd",
        name: "ECSYTHREE",
        noConflict: true,
        file: "build/ecsy-three-all.min.js",
        indent: "\t",
        sourcemap: true,
        plugins: [terser()]
      }
    ]
  }
];
