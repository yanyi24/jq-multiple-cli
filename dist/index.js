"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = require("commander");
const create_1 = tslib_1.__importDefault(require("./actions/create"));
const childCommand_1 = tslib_1.__importDefault(require("./childCommand"));
const program = new commander_1.Command('ymc');
program
    .usage('create <projectName> [options]')
    .command('create <projectName>')
    .description('创建项目')
    .option('-i --install', '是否自动安装依赖', false)
    .option('-pt --pkg-tool [value]', 'npm or yarn:')
    .option('-do --domain [value]', '上线后域名', 'https://www.test.com/')
    .action(create_1.default);
program.addCommand(childCommand_1.default(commander_1.Command));
program.addHelpText('before', `
  Example create a project:
    $ ymc create projectName [option]                创建项目
      option: -i  | --install                        自动安装依赖
              -pt | --pkg-tool [npm | yarn]          选择下载工具
              -do | --domain https://www.domain.com  上线后网站，用于配置canonical
    $ ymc add p pageName                             添加页面
`);
program.version(require('../package.json').version).parse(process.argv);
