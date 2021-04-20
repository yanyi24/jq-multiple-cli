# jQuery 多页面构建工具

## usage

```
npm i jq-multiple-cli -g
在任意目录下：
ymc create myProject // 创建一个项目
```

## create

```
// 基本用法
ymc create myProject

// 是否自动安装依赖，默认 false
-i, --install

// 如果自动安装依赖，选择包管理工具，npm(默认) or yarn
-pt, --pkg-tool [npm|yarn]

// 配置项目上线后域名，用于配置页面canonical
-do, --domain https://www.domain.com
```

## add

```
// 基本用法
ymc add p pageA
将生成
src/pages/pageA/index.ejs
src/pages/pageA/main.ts
src/pages/pageA/index.scss
```

## 其它命令

```
// 查看版本
vmc -V

// 查看帮助信息
vmc -h
```