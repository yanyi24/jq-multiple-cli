import {readdirSync, statSync} from "fs";
import execa from "execa";
import inquirer from "inquirer";
import {pkgToolQues} from "./inquirers";
import chalk from "chalk";
import ora from "ora";

interface FileItem {
  file: string;
  isDir: boolean;
}

function recursiveDir(sourceDir: string) {
  const res: FileItem[] = [];
  function traverse(dir: string) {
    readdirSync(dir).forEach((file: string) => {
      const pathname = `${dir}/${file}`; // temp/.gitignore
      const isDir = statSync(pathname).isDirectory();
      res.push({ file: pathname, isDir });
      if (isDir) {
        traverse(pathname);
      }
    })
  }
  traverse(sourceDir);
  return res;
}

function hasYarn(): boolean {
  try{
    execa.commandSync('yarn -v', { stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}

function exec(command:string, options: execa.Options) {
  return new Promise((resolve, reject) => {
    const subProcess = execa.command(command, options);
    subProcess.stdout!.pipe(process.stdout);
    subProcess.stdout!.on('close', resolve);
    subProcess.stdout!.on('error', reject);
  });
}

async function installPkg(pkgTool: 'npm' | 'yarn', cwd: string) {
  let tool = pkgTool;
  if(!tool) {
    const answers = await inquirer.prompt([pkgToolQues]);
    tool = answers.pkgTool;
  }

  if (tool === 'yarn' && !hasYarn()) {
    console.log(chalk.red('请先安装yarn'));
  } else {
    const spinner = ora(chalk.blue('正在安装依赖...')).start();
    console.log(cwd)
    exec(`${tool} install`, {cwd}).then(res => {
      spinner.succeed(chalk.green('依赖安装成功'));
    }).catch(err => {
      spinner.fail(chalk.green('依赖安装失败，请检查重试'));
    });
  }
}
export {recursiveDir, hasYarn, installPkg};
