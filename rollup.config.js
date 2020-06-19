import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import * as pkg from "./package.json";
const { execSync } = require("child_process");

var deps = {};
Object.keys(pkg.peerDependencies).forEach(dep => {
  deps[dep] = execSync(`npm info ${dep} version`)
    .toString()
    .trim();
});

export default [
  //
  {
    input: "src/index.js",
    plugins: [json({ exclude: ["node_modules/**"] })],
    output: [
      {
        format: "umd",
        name: "ECSY",
        noConflict: true,
        file: "build/ecsy.js",
        indent: "\t"
      },
      {
        format: "es",
        file: "build/ecsy.module.js",
        indent: "\t"
      }
    ]
  },
  // Module unpkg
  {
    input: "src/index.js",
    plugins: [
      alias({
        entries: [
          {
            find: /troika-3d-text\/(.*)/,
            replacement: `https://unpkg.com/troika-3d-text@${deps["troika-3d-text"]}/$1?module`
          },
          {
            find: /three$/,
            replacement: `https://unpkg.com/three@${deps["three"]}/build/three.module.js`
          },
          {
            find: /three\/(.*)/,
            replacement: `https://unpkg.com/three@${deps["three"]}/$1`
          },
          {
            find: "ecsy",
            replacement: `https://unpkg.com/ecsy@${deps["ecsy"]}/build/ecsy.module.js`
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
  // Module with everything included
  {
    input: "src/index-bundled.js",
    plugins: [
      json({ exclude: ["node_modules/**"] }),
      resolve(),
      alias({
        entries: [
          {
            find: /troika-3d-text\/(.*)/,
            replacement: `https://unpkg.com/troika-3d-text@${deps["troika-3d-text"]}/$1?module`
          },
          {
            find: /three$/,
            replacement: `https://unpkg.com/three@${deps["three"]}/build/three.module.js`
          },
          {
            find: /three\/(.*)/,
            replacement: `https://unpkg.com/three@${deps["three"]}/$1`
          },
          {
            find: "ecsy",
            replacement: `https://unpkg.com/ecsy@${deps["ecsy"]}/build/ecsy.module.js`
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
        file: "build/ecsy-three.module.all.js",
        indent: "\t"
      }
    ]
  }
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
