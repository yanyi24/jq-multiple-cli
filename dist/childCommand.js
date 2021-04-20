"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const addPage_1 = tslib_1.__importDefault(require("./actions/addPage"));
function default_1(Command) {
    const generate = new Command('add');
    generate
        .command('p <name>')
        .description('添加页面')
        .action(addPage_1.default);
    return generate;
}
exports.default = default_1;
