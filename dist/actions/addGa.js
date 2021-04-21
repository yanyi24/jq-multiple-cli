"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cheerio_1 = require("cheerio");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const lodash_1 = require("lodash");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const xlsx_1 = tslib_1.__importDefault(require("xlsx"));
class Ga {
    constructor(pageName, dir) {
        this.pageName = pageName;
        this.dir = dir;
    }
    // 获取添加了‘data-ga’的html文件
    getFlagHtml() {
        try {
            const file = fs_extra_1.readFileSync(path_1.join(this.dir, this.pageName, 'index.ejs'), { encoding: 'utf8' });
            const $ = cheerio_1.load(file);
            const btns = $('a,button');
            if (btns.length) {
                const btnsArr = lodash_1.partition(btns, (btn) => {
                    return $(btn).data('ga');
                });
                const hasGaArr = btnsArr[0];
                const noGaArr = btnsArr[1];
                for (let i = 0; i < noGaArr.length; i++) {
                    $(noGaArr[i]).attr('data-ga', this.pageName + (i + hasGaArr.length + 1));
                }
                return $.html();
            }
        }
        catch (e) {
            console.info(chalk_1.default.red(`读取文件${this.pageName}失败`));
        }
    }
    // 获取xlsx文件的代码
    getGa() {
        const workbook = xlsx_1.default.readFile(path_1.join(this.dir, this.pageName, 'ga.xlsx'));
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        return xlsx_1.default.utils.sheet_to_json(worksheet);
    }
    // 获取生成了ga attr 的html
    getGeneratedGaHtml() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const html = this.getFlagHtml();
            const gaCode = this.getGa();
            const $ = cheerio_1.load(html);
            const btns = $('[data-ga]');
            for (let i = 0; i < btns.length; i++) {
                const dom = $(btns[i]);
                const flag = dom.data('ga');
                const code = gaCode.filter(item => item.flag === flag)[0];
                for (const type in code) {
                    if (type !== 'flag') {
                        // @ts-ignore
                        dom.attr(`data-ga-${type}`, code[type]);
                    }
                }
            }
            return lodash_1.unescape($.html());
        });
    }
    reWriteSingleFile() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const html = yield this.getGeneratedGaHtml();
            try {
                fs_extra_1.writeFileSync(path_1.join(this.dir, this.pageName, 'index.ejs'), html, { encoding: 'utf8' });
                console.info(chalk_1.default.green(`文件${this.pageName}添加GA代码成功~`));
            }
            catch (e) {
                console.info(chalk_1.default.red(`重写文件${this.pageName}失败！`));
            }
        });
    }
}
function default_1(name, option) {
    new Ga(name, option.dir).reWriteSingleFile().then();
}
exports.default = default_1;
