import {Command} from 'commander';
import create from "./actions/create";
import childCommand from "./childCommand";

const program = new Command('ymc');

program
  .usage('create <projectName> [options]')
  .command('create <projectName>')
  .description('创建项目')
  .option('-i --install', '是否自动安装依赖', false)
  .option('-pt --pkg-tool [value]', 'npm or yarn:')
  .option('-do --domain [value]', '上线后域名', 'https://www.test.com/')
  .action(create);

program.addCommand(childCommand(Command));

program.addHelpText('before', `
  Example create a project:
    $ ymc create projectName [option]                创建项目
      option: -i  | --install                        自动安装依赖
              -pt | --pkg-tool [npm | yarn]          选择下载工具
              -do | --domain https://www.domain.com  上线后网站，用于配置canonical
    $ ymc add p pageName                             添加页面
`);

program.version(require('../package.json').version).parse(process.argv);
