import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import type { CreateOptions } from '../types.js'
import Generator from './Generator.js'

export default async function create(name: string, options: CreateOptions) {
  // 验证是否正常取到值
  console.log('>>> create.js', name, options)
  // 目录是否已经存在
  // 如果存在
  // 		当 { force: true } 时，直接移除原来的目录，直接创建
  // 		当 { force: false } 时 询问用户是否需要覆盖
  // 如果不存在，直接创建

  // 当前命令行选择的目录
  const cwd = process.cwd()

  // 需要创建的目录地址
  const targetAir = path.join(cwd, name)

  // 目录是否已经存在？
  if (fs.existsSync(targetAir)) {
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      // 询问是否覆盖
      const { action } = await inquirer.prompt<{ action: boolean }>([
        {
          name: 'action',
          type: 'list',
          message: '该目录已经存在，是否覆盖:',
          choices: [
            { name: '覆盖', value: true },
            { name: '不覆盖', value: false },
          ],
        },
      ])

      if (!action) return

      // 移除已存在的目录
      console.log(`\r\nRemoving...`)
      await fs.remove(targetAir)
    }
  }

  const generator = new Generator(name, targetAir)

  await generator.create()
}
