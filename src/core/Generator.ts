import util from 'node:util'
import path from 'node:path'
import ora from 'ora'
import inquirer from 'inquirer'
import downloadGitRepo from 'download-git-repo'
import chalk from 'chalk'
import shell from 'shelljs'
import { REPO_NAME } from '../config.js'
import { getRepoList, getTagList } from './http.js'
// 添加加载动画
const downloadGitRepoByPromise = util.promisify(downloadGitRepo)
type PromiseReturn<T> = T extends () => Promise<infer Value> ? Value : never

export default class Generator {
  private name: string
  private targetDir: string

  constructor(name: string, targetDir: string) {
    // 目录名称
    this.name = name
    // 创建位置
    this.targetDir = targetDir
  }

  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己新下载的模板名称
  // 3）return 用户选择的名称
  async getRepo() {
    // 1）从远程拉取模板数据
    const repoList = await wrapLoading(() => getRepoList(), '拉取 template...')
    if (!repoList) return

    // 过滤我们需要的模板名称
    const repos = repoList.map((item: { name: string }) => item.name)

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt<{ repo: string }>({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: '选择一个模板进行创建',
    })

    // 3）return 用户选择的名称
    return repo
  }

  // 获取用户选择的版本
  // 1）基于 repo 结果，远程拉取对应的 tag 列表
  // 2）用户选择自己需要下载的 tag
  // 3）return 用户选择的 tag
  async getTag(repo: string) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(() => getTagList(repo), '拉取 tag ...')

    if (!tags) return

    // 过滤我们需要的 tag 名称
    const tagsList = tags.map((item: { name: string }) => item.name)

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt<{ tag: string }>({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: '选择模板版本',
    })

    // 3）return 用户选择的 tag
    return tag
  }

  // 下载远程模板
  // 1）拼接下载地址
  // 2）调用下载方法
  async download(repo: string, tag: string) {
    if (!REPO_NAME) {
      console.log('请配置 REPO_NAME')
      return
    }
    // 1）拼接下载地址
    const requestUrl = `${REPO_NAME}/${repo}${tag ? `#${tag}` : ''}`
    const localPath = path.resolve(process.cwd(), this.targetDir)
    // 2）调用下载方法
    await wrapLoading(
      // 远程下载方法
      // 参数1: 下载地址
      // 参数2: 创建位置
      () => downloadGitRepoByPromise(requestUrl, localPath),
      // 加载提示信息
      '请稍后...正在下载 template ',
    )
  }

  async install() {
    //  是否需要下载依赖
    const { install } = await inquirer.prompt<{ install: boolean }>({
      name: 'install',
      type: 'list',
      message: '是否需要下载依赖',
      choices: [
        { name: '下载', value: true },
        { name: '否', value: false },
      ],
    })

    if (!install) return
    const pnpmExec = shell.which('pnpm')
    if (!pnpmExec) {
      shell.exec('npm install pnpm -g')
    }
    shell.cd(this.name)
    shell.exec('git init && pnpm install')
    console.log('安装完成 \r\n')
  }

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create() {
    // 1）获取模板名称
    const repo = await this.getRepo()
    if (!repo) return
    // 2) 获取 tag 名称
    const tag = await this.getTag(repo)
    if (!tag) return
    // 3）下载模板到模板目录
    await this.download(repo, tag)
    await this.install()

    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  pnpm run dev\r\n')
  }
}

async function wrapLoading<T extends () => Promise<any>>(
  fn: T,
  message: string,
): Promise<undefined | Awaited<PromiseReturn<T>>> {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message)
  // 开始加载动画
  spinner.start()

  try {
    // 执行传入方法 fn
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await fn()
    // 状态为修改为成功
    spinner.succeed()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result
  } catch (error) {
    // 状态为修改为失败
    spinner.fail('Request failed, refetch ...')
  }
}
