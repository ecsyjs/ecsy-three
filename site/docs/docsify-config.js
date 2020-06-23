window.$docsify = {
  name: "ECSY Three",
  loadSidebar: true,
  auto2top: true,
  homepage: "./README.md",
  relativePath: true,
  search: {
    paths: "auto",
    depth: 3
  },
  plugins: [window.docsifyTocBackPlugin]
};
