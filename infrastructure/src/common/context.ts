import { Node } from 'constructs'

export const getRequiredContextString = (node: Node, key: string): string => {
  const value = node.tryGetContext(key)
  if (value === undefined || value === null || typeof value !== 'string') {
    throw new Error(`Context key '${key}' is required to exist and be a string.`)
  }
  return value
}

export const getRequiredContextObject = (node: Node, key: string): Record<string, unknown> => {
  const value = node.tryGetContext(key)
  if (value === undefined || value === null || typeof value !== 'object') {
    throw new Error(`Context key '${key}' is required to exist and be an object.`)
  }
  return value
}
