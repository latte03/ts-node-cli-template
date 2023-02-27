export interface RepoTag {
  name: string
  commit: Commit
  zipball_url: string
  tarball_url: string
  node_id: string
}

export interface Commit {
  sha: string
  url: string
}
