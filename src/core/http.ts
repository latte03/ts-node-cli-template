import axios from 'axios'
import { app } from '@/config.js'
import type { Repos } from '@/types/index.js'

axios.interceptors.response.use((res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.data
})

export async function getRepoList(): Promise<Repos[]> {
  const content = await axios.get<Repos[], Repos[]>(
    `https://api.github.com/users/${app.REPO_NAME}/repos`,
  )
  return content.filter((repo) => {
    return repo.is_template
  })
}

export async function getTagList(repo: string): Promise<any[]> {
  return axios.get(`https://api.github.com/repos/${app.REPO_NAME}/${repo}/tags`)
}
