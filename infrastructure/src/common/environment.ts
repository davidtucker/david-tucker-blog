import { getRequiredContextObject } from './context'
import { Node } from 'constructs'
import * as fs from 'fs'
import * as path from 'path'

export class VestryEnvironment {
  readonly account: string

  readonly primaryRegion: string

  readonly domain: string

  readonly isProduction: boolean

  readonly allowedIPRanges: string[]

  static marshall = (contextEnv: Record<string, unknown>): VestryEnvironment => {
    if (contextEnv === undefined || contextEnv === null || typeof contextEnv !== 'object') {
      throw new Error(`Context environment is required to exist and be an object.`)
    }
    const environment: VestryEnvironment = <VestryEnvironment>{
      account: contextEnv.account,
      primaryRegion: contextEnv.primaryRegion,
      domain: contextEnv.domain,
      isProduction: contextEnv.isProduction,
      allowedIPRanges: contextEnv.allowedIPRanges,
    }
    return environment
  }

  static fromContext = (node: Node, name: string): VestryEnvironment => {
    const environments = getRequiredContextObject(node, 'environments')
    const contextEnv = environments[name] as Record<string, unknown>
    const output = VestryEnvironment.marshall(contextEnv)
    return output
  }

  static hasLocal = (): boolean => {
    const localEnvPath = path.join('..', 'vestry.env.json')
    if (fs.existsSync(localEnvPath)) {
      return true
    }
    return false
  }

  static fromLocal = (): VestryEnvironment => {
    const localEnvPath = path.join('..', 'vestry.env.json')
    const data = fs.readFileSync(localEnvPath, 'utf-8')
    const contextEnvironment = JSON.parse(data)
    return VestryEnvironment.marshall(contextEnvironment)
  }
}

export class SharedServicesEnvironment {
  readonly account: string

  readonly region: string

  readonly settingsSecretARN: string

  static fromContext = (node: Node): SharedServicesEnvironment => {
    const environments = getRequiredContextObject(node, 'environments')
    const contextEnv = environments.sharedServices as Record<string, unknown>
    if (contextEnv === undefined || contextEnv === null || typeof contextEnv !== 'object') {
      throw new Error(`Context key 'environments.sharedServices' is required to exist and be an object.`)
    }
    const environment: SharedServicesEnvironment = <SharedServicesEnvironment>{
      account: contextEnv.account,
      region: contextEnv.primaryRegion,
      settingsSecretARN: contextEnv.settingsSecretARN,
    }
    return environment
  }
}
