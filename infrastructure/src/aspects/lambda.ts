import { aws_lambda as lambda, IAspect, Annotations } from 'aws-cdk-lib'
import { IConstruct } from 'constructs'

import { NodeJSLambdaFunction } from '../constructs/lambda'

const REQUIRED_ENVIRONMENT_VARIABLES = ['NODE_ENV', 'LOGGING_LEVEL']

const ALLOWED_RUNTIMES_DEFAULT = [lambda.Runtime.NODEJS_12_X]

export class LambdaEnvironmentChecker implements IAspect {
  readonly allowedRuntimes: lambda.Runtime[]

  constructor(allowedRuntimes: lambda.Runtime[] = ALLOWED_RUNTIMES_DEFAULT) {
    this.allowedRuntimes = allowedRuntimes
  }

  public visit(node: IConstruct): void {
    if (node instanceof NodeJSLambdaFunction) {
      const lambdaFunc = node as NodeJSLambdaFunction
      this.checkRuntimeVersion(lambdaFunc)
      this.checkNodeEnvironment(lambdaFunc)
    }
  }

  private checkRuntimeVersion(node: NodeJSLambdaFunction): void {
    const { runtime } = node
    if (!this.allowedRuntimes.includes(runtime)) {
      Annotations.of(node).addError(`Disallowed Lambda runtime: ${runtime}`)
    }
  }

  private checkNodeEnvironment(node: NodeJSLambdaFunction): void {
    // We have to circumvent TypeScript here to get access to environment which
    // is a private property. Ideally, this shouldn't be a private property,
    // it should be a readonly property.
    const { environment } = <any>node
    const errors: string[] = []
    REQUIRED_ENVIRONMENT_VARIABLES.forEach(v => {
      if (!Object.prototype.hasOwnProperty.call(environment, v)) {
        errors.push(v)
      }
    })
    if (errors.length > 0) {
      Annotations.of(node).addError(`Must contain environment variables ${errors}`)
    }
  }
}
