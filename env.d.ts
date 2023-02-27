declare module 'download-git-repo' {

  function download(repo: string, dest: string, opts?, fn?): any
  export default download
}
