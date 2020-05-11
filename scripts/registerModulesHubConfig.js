const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

var program = require('commander');

const DIST_DIR = path.resolve(process.cwd(), './dist');

program
  .version('0.1.0')
  .arguments('<moduleName>')
  .option('-d, --dir <string>', 'Hub file dir')
  .option('-u, --url <string>', 'Hub api url')
  .action(async moduleName => {
    console.log(chalk.blue('Processing...'));

    if (program.dir) {
      await rewriteModulesConfigInDir(moduleName, program.dir);
    }

    if (program.url) {
      await registerModuleConfigByApi(moduleName, program.url);
    }

    console.log(chalk.green('success'));
  })
  .parse(process.argv);

async function rewriteModulesConfigInDir(moduleName, dir) {
  if (!(await fs.pathExists(dir))) {
    chalk.red('Dir not exist.');
    return;
  }

  const filePath = path.join(dir, '.modules.js');

  let modulesConfig = {};

  if (await fs.pathExists(filePath)) {
    const modulesConfigJsonpStr = await fs.readFile(filePath, 'utf-8');
    const window = {};
    eval(modulesConfigJsonpStr);
    modulesConfig = window.hubModulesConfigMap;
  }

  const config = await buildModuleConfig();

  modulesConfig[moduleName] = config;

  await fs.writeFile(filePath, `
(function () {
  window.hubModulesConfigMap = ${JSON.stringify(modulesConfig, ' ', 4)};
}());
`);
}

async function registerModuleConfigByApi() {
  // TODO: 后端接口完成后实现
}

async function buildModuleConfig() {
  const jsFiles = await searchFileInDist('js');
  const cssFiles = await searchFileInDist('css');
  return {
    script: jsFiles && jsFiles[0],
    css: cssFiles && cssFiles[0],
  };
}

async function searchFileInDist(suffix) {
  const files = await fs.readdir(DIST_DIR);
  const regExp = new RegExp(`\\.${suffix}$`);
  return files.filter(regExp.test.bind(regExp));
}
