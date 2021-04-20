import artTemplate from "art-template";
import chalk from "chalk";
import { kebabCase } from "lodash";
import { join } from "path";
import {outputFileSync, existsSync, readdirSync} from "fs-extra";

export default function (name: string, option: {tsx: boolean}) {
  const domain = require('../../settings.json').domain;
  const dirLevel = name.split('/').length;
  let dir = '../';
  for (let i = 0; i < dirLevel; i++) {
    dir += '../';
  }
  try {
    const tplPath = join(__dirname, '../../templates/page');
    const files = readdirSync(tplPath);
    let error = false;
    files.forEach(item => {
      const content = artTemplate(
        join(tplPath, item),
        {name, dir, className: kebabCase(name), canonical: domain.endsWith('/') ? `${domain}${name}.html` : `${domain}/${name}.html` }
      );
      const dest = `src/pages/${name}/${item}`;
      if (existsSync(dest)) {
        console.error(chalk.red(`创建失败：文件${dest}已存在`));
        error = true;
      } else {
        outputFileSync(dest, content);
      }
    });
    if (!error) {
      console.info(chalk.green(`创建${name}页面成功>>>>`) + chalk.blue(`src/pages/${name}`));
    }

  } catch (e) {
    console.error(chalk.red('创建页面失败~'));
    throw e;
  }
}


