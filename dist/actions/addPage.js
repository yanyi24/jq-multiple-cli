"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const art_template_1 = tslib_1.__importDefault(require("art-template"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const lodash_1 = require("lodash");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
function default_1(name) {
    const domain = require(process.cwd() + '/settings.json').domain;
    const dirLevel = name.split('/').length;
    let dir = '../';
    for (let i = 0; i < dirLevel; i++) {
        dir += '../';
    }
    try {
        const tplPath = path_1.join(__dirname, '../../templates/page');
        const files = fs_extra_1.readdirSync(tplPath);
        let error = false;
        files.forEach(item => {
            const content = art_template_1.default(path_1.join(tplPath, item), { name, dir, className: lodash_1.kebabCase(name), canonical: domain.endsWith('/') ? `${domain}${name}.html` : `${domain}/${name}.html` });
            const dest = `src/pages/${name}/${item}`;
            if (fs_extra_1.existsSync(dest)) {
                console.error(chalk_1.default.red(`创建失败：文件${dest}已存在`));
                error = true;
            }
            else {
                fs_extra_1.outputFileSync(dest, content);
            }
        });
        if (!error) {
            console.info(chalk_1.default.green(`创建${name}页面成功>>>>`) + chalk_1.default.blue(`src/pages/${name}`));
        }
    }
    catch (e) {
        console.error(chalk_1.default.red('创建页面失败~'));
        throw e;
    }
}
exports.default = default_1;
