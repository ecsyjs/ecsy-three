import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import * as pkg from "./package.json";

export default [
  // Module unpkg
  {
    input: "src/index.js",
    plugins: [
      alias({
        entries: [
          {
            find: /three$/,
            replacement: `https://unpkg.com/three@${pkg.dependencies.three}/build/three.module.js`
          },
          {
            find: /three\/(.*)/,
            replacement: `https://unpkg.com/three@${pkg.dependencies.three}/$1`
          },
          {
            find: "ecsy",
            replacement: `https://unpkg.com/ecsy@${pkg.dependencies.ecsy}/build/ecsy.module.js`
          }
        ]
      })
    ],
    external: id => {
      return id.startsWith("https://unpkg.com/");
    },
    output: [
      {
        format: "es",
        file: "build/ecsy-three.module-unpkg.js",
        indent: "\t"
      }
    ]
  },

  // Module
  {
    input: "src/index.js",
    plugins: [json({ exclude: ["node_modules/**"] })],
    external: id => {
      return id.startsWith("three") || id === "ecsy";
    },
    output: [
      {
        format: "es",
        file: "build/ecsy-three.module.js",
        indent: "\t"
      }
    ]
  },
/*
  {
    input: "src/index.js",
    plugins: [json({ exclude: ["node_modules/**"] })],
    output: [
      {
        format: "umd",
        name: "ECSY",
        noConflict: true,
        file: "build/ecsy-three.umd.js",
        indent: "\t"
      }
    ]
  }
  */
];
