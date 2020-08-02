const fs = require("fs");
const path = require("path");
const util = require('util');
const cpy = require('cpy');
const readFile = util.promisify(fs.readFile);
const exec = util.promisify(require('child_process').exec);
const rimraf = util.promisify(require('rimraf'));

async function buildExample(example) {
  console.log(`Building ${example.name}...`);

  const packagePath = path.join(example.srcPath, "package.json");

  if (fs.existsSync(packagePath)) {
    const packageText = await readFile(packagePath);
    const package = JSON.parse(packageText);

    if (package.scripts && package.scripts.build) {
      const { stdout, stderr } = await exec("npm run build", { cwd: example.srcPath });

      if (stderr) {
        console.error(`${example-name}: ${stderr}`);
      }

      if (stdout) {
        console.log(stdout);
      }
    }
  }

  if (fs.existsSync(example.destPath)) {
    await rimraf(example.destPath);
  }

  const publicPath = path.join(example.srcPath, "public");

  await cpy(".", example.destPath, { parents: true, cwd: publicPath });
}

async function main() {
  const examplesDir = path.resolve(__dirname, "..", "examples");

  const examples = fs.readdirSync(examplesDir,  { withFileTypes: true })
    .filter(dirEnt => dirEnt.isDirectory())
    .map(dirEnt => ({
      name: dirEnt.name,
      srcPath: path.resolve(__dirname, "..", "examples", dirEnt.name),
      destPath: path.resolve(__dirname, "..", "site", "examples", dirEnt.name)
    }));

  for (const example of examples) {
    await buildExample(example);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
