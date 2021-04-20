const pkgToolQues =  {
  type: 'list',
  name: 'pkgTool',
  choices: ['npm', 'yarn'],
  default: 'npm',
  message: 'npm or yarn'
}

const installQues = {
  type: 'confirm',
  name: 'install',
  default: false,
  message: '是否自动安装依赖？'
}

const cssPreQuees = {
  type: 'list',
  name: 'cssPre',
  choice: ['less', 'scss'],
  default: 'scss',
  message: 'Pick a CSS pre-processor'
}

export {pkgToolQues, installQues, cssPreQuees};
