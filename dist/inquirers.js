"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cssPreQuees = exports.installQues = exports.pkgToolQues = void 0;
const pkgToolQues = {
    type: 'list',
    name: 'pkgTool',
    choices: ['npm', 'yarn'],
    default: 'npm',
    message: 'npm or yarn'
};
exports.pkgToolQues = pkgToolQues;
const installQues = {
    type: 'confirm',
    name: 'install',
    default: false,
    message: '是否自动安装依赖？'
};
exports.installQues = installQues;
const cssPreQuees = {
    type: 'list',
    name: 'cssPre',
    choice: ['less', 'scss'],
    default: 'scss',
    message: 'Pick a CSS pre-processor'
};
exports.cssPreQuees = cssPreQuees;
