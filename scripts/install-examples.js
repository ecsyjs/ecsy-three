const fs = require("fs");
const path = require("path");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function installExample(example) {
  console.log(`Installing ${example.name}...`);

  const packagePath = path.join(example.srcPath, "package.json");

  if (fs.existsSync(packagePath)) {
    const { stdout, stderr } = await exec("npm ci", { cwd: example.srcPath });

    if (stderr) {
      console.error(`${example.name}: ${stderr}`);
    }

    if (stdout) {
      console.log(stdout);
    }
  }
}

async function main() {
  const examplesDir = path.resolve(__dirname, "..", "examples");

  const examples = fs.readdirSync(examplesDir,  { withFileTypes: true })
    .filter(dirEnt => dirEnt.isDirectory())
    .map(dirEnt => ({
      name: dirEnt.name,
      srcPath: path.resolve(__dirname, "..", "examples", dirEnt.name),
    }));

  for (const example of examples) {
    await installExample(example);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
