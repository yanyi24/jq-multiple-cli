import {promisify} from "util";
import download from 'download-git-repo';
import artTemplate from "art-template";
import chalk from "chalk";
import ora from "ora";
import {installPkg, recursiveDir} from '../utils';
import {partition} from 'lodash';
import {readFileSync, unlinkSync, writeFileSync} from "fs-extra";
import inquirer from "inquirer";
import {installQues, pkgToolQues} from "../inquirers";
import {resolve} from 'path';

interface CreateOptions{
  install: boolean;
  pkgTool: 'npm' | 'yarn';
  domain: string;
}

const downloadTemplate = promisify<string, string, {clone: boolean}>(download);
const gitUrl = 'https://gitee.com/yanyi24_yanyi9399/jq-page-template.git';

const rule = artTemplate.defaults.rules[0];
rule.test = new RegExp(rule.test.source.replace('<%', '<\\\?').replace('%>', '\\\?>'));

export default async function (projectName: string, options: CreateOptions) {
  const spinner = ora(chalk.blue('初始化模板...')).start();

  try {
    await downloadTemplate('direct:' + gitUrl, projectName, {clone: true});
    const allFiles = recursiveDir(projectName);
    const cwd = './' + projectName;

    if (allFiles.length) {
      partition(allFiles, 'isDir')[1].forEach(item => {
        if (!item.file.includes('assets')) {
          const content = artTemplate(process.cwd() + '/' + item.file, { projectName, domain: options.domain });
          let dist = item.file;
          if (dist.includes('.art')) {
            unlinkSync(dist);
            dist = dist.replace(/\.art/, '');
          }
          writeFileSync(dist, content);
        }
      });
      spinner.info('模版初始化成功');

      writeFileSync(resolve(process.cwd(),'settings.json'), readFileSync(resolve(cwd, 'config/settings.json')));

      if (options.install || options.pkgTool) {
        installPkg(options.pkgTool, cwd)
      } else {
        const answers = await inquirer.prompt([
          installQues,
          {
            ...pkgToolQues,
            when(currentAnswers) {
              return currentAnswers.install;
            }
          }
        ]);
        if (answers.install) {
          installPkg(answers.pkgTool || options.pkgTool, cwd)
        } else {
          console.log(chalk.green('项目创建成功'));
          spinner.info(chalk.blue(`
            $ cd ${projectName}
            $ npm install or yarn install
            $ npm start
          `));
        }
      }
    }
  } catch (e) {
    spinner.fail('创建项目失败');
    throw e;
  }
}


