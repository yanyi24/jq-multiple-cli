# jQuery 多页面构建工具

一个使用webpack打包的jQuery 多页面构建工具。css预处理使用scss，jQuery使用CDN方式引入，并使用TS。同时支持PWA技术，开箱即用。
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
src/pages/pageA/index.ts
src/pages/pageA/index.scss
```

## 其它命令

```
// 查看版本
ymc -V

// 查看帮助信息
ymc -h
```

## 其他说明

1. 打包项目：npm build;
2. 打包后可以使用 npm serve, 可以在创建一个本地服务器，以便查看项目，PWA功能才能生效；
3. webpack的热更新只适用于样式文件，其他html文件更新需要手动刷新；
4. 由于使用ejs加载了公共头部、尾部，所以修改公共头部后需要在引入的页面随便修改点什么才能看到变化（或者重新start一下）；
5. ts中使用jQuery需要import，在项目打包时不会打包jQuery。