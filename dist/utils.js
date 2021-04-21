"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPkg = exports.hasYarn = exports.recursiveDir = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const execa_1 = tslib_1.__importDefault(require("execa"));
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const inquirers_1 = require("./inquirers");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ora_1 = tslib_1.__importDefault(require("ora"));
function recursiveDir(sourceDir) {
    const res = [];
    function traverse(dir) {
        fs_1.readdirSync(dir).forEach((file) => {
            const pathname = `${dir}/${file}`; // temp/.gitignore
            const isDir = fs_1.statSync(pathname).isDirectory();
            res.push({ file: pathname, isDir });
            if (isDir) {
                traverse(pathname);
            }
        });
    }
    traverse(sourceDir);
    return res;
}
exports.recursiveDir = recursiveDir;
function hasYarn() {
    try {
        execa_1.default.commandSync('yarn -v', { stdio: 'ignore' });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.hasYarn = hasYarn;
function exec(command, options) {
    return new Promise((resolve, reject) => {
        const subProcess = execa_1.default.command(command, options);
        subProcess.stdout.pipe(process.stdout);
        subProcess.stdout.on('close', resolve);
        subProcess.stdout.on('error', reject);
    });
}
function installPkg(pkgTool, cwd) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let tool = pkgTool;
        if (!tool) {
            const answers = yield inquirer_1.default.prompt([inquirers_1.pkgToolQues]);
            tool = answers.pkgTool;
        }
        if (tool === 'yarn' && !hasYarn()) {
            console.log(chalk_1.default.red('请先安装yarn'));
        }
        else {
            const spinner = ora_1.default(chalk_1.default.blue('正在安装依赖...')).start();
            exec(`${tool} install`, { cwd }).then(res => {
                spinner.succeed(chalk_1.default.green('依赖安装成功'));
            }).catch(err => {
                spinner.fail(chalk_1.default.green('依赖安装失败，请检查重试'));
            });
        }
    });
}
exports.installPkg = installPkg;
