const fs = require("fs");
const path = require("path");
const util = require('util');
const readFile = util.promisify(fs.readFile);
const exec = util.promisify(require('child_process').exec);

async function linkExample(example) {
  const packagePath = path.join(example.srcPath, "package.json");

  if (fs.existsSync(packagePath)) {
    const packageText = await readFile(packagePath);
    const package = JSON.parse(packageText);

    if (package.dependencies && package.dependencies["ecsy-three"]) {
      console.log(`Linking ecsy-three into ${example.name}...`);

      const { stdout, stderr } = await exec("npm link ecsy-three", { cwd: example.srcPath });

      if (stderr) {
        console.error(`${example.name}: ${stderr}`);
      }

      if (stdout) {
        console.log(stdout);
      }
    }
  }
}

async function main() {
  const { stdout, stderr } = await exec("npm link", { cwd: path.resolve(__dirname, "..") });

  if (stderr) {
    console.error(stderr);
  }

  if (stdout) {
    console.log(stdout);
  }

  const examplesDir = path.resolve(__dirname, "..", "examples");

  const examples = fs.readdirSync(examplesDir,  { withFileTypes: true })
    .filter(dirEnt => dirEnt.isDirectory())
    .map(dirEnt => ({
      name: dirEnt.name,
      srcPath: path.resolve(__dirname, "..", "examples", dirEnt.name)
    }));

  for (const example of examples) {
    await linkExample(example);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
