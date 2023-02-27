module.exports = {
  // type 类型
  types: [
    { value: 'feat', name: '✨ 新增产品功能' },
    { value: 'fix', name: '🐛 修复 bug' },
    { value: 'docs', name: '📝 文档的变更' },
    {
      value: 'style',
      name: '💄 不改变代码功能的变动(如删除空格、格式化、去掉末尾分号等)',
    },
    {
      value: 'refactor',
      name: '♻ 重构代码。不包括 bug 修复、功能新增',
    },
    {
      value: 'perf',
      name: '⚡ 性能优化',
    },
    { value: 'test', name: '✅ 添加、修改测试用例' },
    {
      value: 'build',
      name: '👷‍ 构建流程、外部依赖变更，比如升级 npm 包、修改 webpack 配置',
    },
    { value: 'ci', name: '🔧 修改了 CI 配置、脚本' },
    {
      value: 'chore',
      name: '对构建过程或辅助工具和库的更改,不影响源文件、测试用例的其他操作',
    },
    { value: 'revert', name: '⏪ 回滚 commit' },
  ],

  scopes: [
    ['utils', 'utils 相关'],
    ['deps', '项目依赖'],
    ['auth', '对 auth 修改'],
    ['config', '其他修改'],
    ['other', '其他修改'],
  ].map(([value]) => {
    return { value, name: value }
  }),

  // 覆写提示的信息
  messages: {
    type: '请确保你的提交遵循了原子提交规范！\n选择你要提交的类型:',
    scope: '\n选择一个 scope (可选):',
    // 选择 scope: custom 时会出下面的提示
    customScope: '请输入自定义的 scope:',
    subject: '填写一个简短精炼的描述语句:\n',
    body: '添加一个更加详细的描述，可以附上新增功能的描述或 bug 链接、截图链接 (可选)。使用 "|" 换行:\n',
    breaking: '列举非兼容性重大的变更 (可选):\n',
    footer: '列举出所有变更的 ISSUES CLOSED  (可选)。 例如.: #31, #34:\n',
    confirmCommit: '确认提交?',
  },

  // 是否允许自定义填写 scope ，设置为 true ，会自动添加两个 scope 类型 [{ name: 'empty', value: false },{ name: 'custom', value: 'custom' }]
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  skipQuestions: ['body'],

  // subject 限制长度
  subjectLimit: 100,
}
