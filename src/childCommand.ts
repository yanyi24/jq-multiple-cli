import {CommandConstructor} from 'commander';
import addPage from "./actions/addPage";
import addGa from "./actions/addGa";

export default function (Command: CommandConstructor) {
  const generate = new Command('add');

  generate
    .command('p <name>')
    .description('添加页面')
    .action(addPage);

  generate
    .command('ga <name>')
    .option('--dir [value]', '页面上级目录地址', 'src/pages/')
    .description('添加页面ga代码')
    .action(addGa);

  return generate;
}
