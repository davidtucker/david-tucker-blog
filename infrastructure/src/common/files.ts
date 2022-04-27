import findup from 'find-up'
import path from 'path'

export const getProjectRootDirectory = (): string => {
  const rootDirectory = findup.sync(
    dir => {
      const hasInfrastructure = findup.sync.exists(path.join(dir, 'infrastructure'))
      const hasWebapps = findup.sync.exists(path.join(dir, 'webapps'))
      return hasInfrastructure && hasWebapps ? dir : undefined
    },
    { type: 'directory', cwd: __dirname },
  )
  if (!rootDirectory) {
    throw new Error('Could not find infrastructure directory')
  }
  return rootDirectory
}

export const referenceFromRootDirectory = (reference: string): string => {
  return path.join(getProjectRootDirectory(), ...reference.split('/'))
}
