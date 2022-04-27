import { aws_lambda_nodejs as nodeLambda, aws_lambda as lambda } from 'aws-cdk-lib'
import { Construct } from 'constructs'

interface NodeJSLambdaFunctionProps extends nodeLambda.NodejsFunctionProps {
  isProduction: boolean
  loggingLevel: string
}

export class NodeJSLambdaFunction extends nodeLambda.NodejsFunction {
  constructor(scope: Construct, id: string, props: NodeJSLambdaFunctionProps) {
    const runtime = props.runtime ?? lambda.Runtime.NODEJS_12_X
    super(scope, id, {
      ...props,
      runtime,
    })
    const nodeEnv = props.isProduction ? 'production' : 'development'
    this.addEnvironment('NODE_ENV', nodeEnv)
    this.addEnvironment('LOG_LEVEL', props.loggingLevel)
  }
}
