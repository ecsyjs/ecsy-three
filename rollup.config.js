import json from "rollup-plugin-json";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";

export default [
  {
    external: ["three", "ecsy"],
    globals: {
      "three": "THREE",
      "ecsy": "ECSY"
    },
    input: "src/index.js",
    plugins: [
      json({ exclude: ["node_modules/**"] }),
      resolve({
        customResolveOptions: {
          moduleDirectory: "node_modules"
        }
      })
      // resolve()
    ],
    output: [
      /*
      {
        format: "umd",
        name: "ECSYTHREE",
        noConflict: true,
        file: "build/ecsy-three.js",
        indent: "\t"
      },*/
      {
        format: "es",
        file: "build/ecsy-three.module.js",
        indent: "\t"
      }
    ]
  },
  /*
  {
    external: ["three", "ecsy"],
    input: "src/index.js",
    plugins: [
      json({ exclude: ["node_modules/**"] })
      // resolve()
    ],
    output: [
      {
        format: "umd",
        name: "ECSYTHREE",
        noConflict: true,
        file: "build/ecsy-three.js",
        indent: "\t"
      },
      {
        format: "es",
        file: "build/ecsy-three.module.js",
        indent: "\t"
      }
    ]
  },
  {
    input: "src/index.js",
    plugins: [json({ exclude: ["node_modules/**"] }), terser()],
    output: [
      {
        format: "umd",
        name: "ECSYTHREE",
        noConflict: true,
        file: "build/ecsy-three.min.js",
        indent: "\t"
      }
    ]
  }*/
];
