const spawnSync = require('child_process').spawnSync;
const path = require('path');
const chalk = require('chalk');
const os = require('os');
const platform = os.platform();

const pathRelated = path.relative(
  path.join(__dirname, '..'),
  process.cwd()
);

console.log(chalk.cyan('正在启动：', pathRelated));

const result = spawnSync(platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'doServeModule'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_BUILD_MODULE_PATH: pathRelated
  },
});

if (result.error) {
  console.log(chalk.red(result.error));
} else {
  console.log(chalk.green('Finished ~'));
}
