"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("util");
const download_git_repo_1 = tslib_1.__importDefault(require("download-git-repo"));
const art_template_1 = tslib_1.__importDefault(require("art-template"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ora_1 = tslib_1.__importDefault(require("ora"));
const utils_1 = require("../utils");
const lodash_1 = require("lodash");
const fs_extra_1 = require("fs-extra");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const inquirers_1 = require("../inquirers");
const downloadTemplate = util_1.promisify(download_git_repo_1.default);
const gitUrl = 'https://github.com/yanyi24/jq-page-template.git';
const rule = art_template_1.default.defaults.rules[0];
rule.test = new RegExp(rule.test.source.replace('<%', '<\\\?').replace('%>', '\\\?>'));
function default_1(projectName, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const spinner = ora_1.default(chalk_1.default.blue('初始化模板...')).start();
        try {
            yield downloadTemplate('direct:' + gitUrl, projectName, { clone: true });
            const allFiles = utils_1.recursiveDir(projectName);
            const cwd = './' + projectName;
            if (allFiles.length) {
                lodash_1.partition(allFiles, 'isDir')[1].forEach(item => {
                    if (!item.file.includes('assets')) {
                        const content = art_template_1.default(process.cwd() + '/' + item.file, { projectName, domain: options.domain });
                        let dist = item.file;
                        if (dist.includes('.art')) {
                            fs_extra_1.unlinkSync(dist);
                            dist = dist.replace(/\.art/, '');
                        }
                        fs_extra_1.writeFileSync(dist, content);
                    }
                });
                spinner.info('模版初始化成功');
                // writeFileSync(resolve(process.cwd(),projectName+'/settings.json'), readFileSync(resolve(cwd, 'config/settings.json')));
                if (options.install || options.pkgTool) {
                    utils_1.installPkg(options.pkgTool, cwd);
                }
                else {
                    const answers = yield inquirer_1.default.prompt([
                        inquirers_1.installQues,
                        Object.assign(Object.assign({}, inquirers_1.pkgToolQues), { when(currentAnswers) {
                                return currentAnswers.install;
                            } })
                    ]);
                    if (answers.install) {
                        utils_1.installPkg(answers.pkgTool || options.pkgTool, cwd);
                    }
                    else {
                        console.log(chalk_1.default.green('项目创建成功'));
                        spinner.info(chalk_1.default.blue(`
            $ cd ${projectName}
            $ npm install or yarn install
            $ npm start
          `));
                    }
                }
            }
        }
        catch (e) {
            spinner.fail('创建项目失败');
            throw e;
        }
    });
}
exports.default = default_1;
