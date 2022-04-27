import * as apigi from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import * as apigv2 from '@aws-cdk/aws-apigatewayv2-alpha'
import { Construct } from 'constructs'

import { ContextEnvironmentProps } from '../../common'
import { NodeJSLambdaFunction } from '../lambda'

export interface APIServiceProps extends ContextEnvironmentProps {
  httpApi: apigv2.HttpApi
  base: string
}

export class APIService extends Construct {
  public readonly httpApi: apigv2.HttpApi

  public readonly base: string

  constructor(scope: Construct, id: string, props: APIServiceProps) {
    super(scope, id)
    this.base = props.base
    this.httpApi = props.httpApi
  }

  public addMicroservice(microservice: APIMicroservice): void {
    if (!microservice.apiPath.startsWith(this.base)) {
      console.error(`Service base: ${this.base}, Microservice API path: ${microservice.apiPath}`)
      throw new Error(`Microservice must begin with service base.`)
    }
    this.httpApi.addRoutes({
      path: microservice.apiPath,
      methods: microservice.methods,
      integration: microservice.integration,
    })
  }
}

export interface APIMicroserviceProps extends ContextEnvironmentProps {
  apiPath: string
  path: string
  handler?: string
  methods: apigv2.HttpMethod[]
}

export class APIMicroservice extends Construct {
  public readonly apiPath: string

  public readonly path: string

  public readonly methods: apigv2.HttpMethod[]

  public readonly serviceLambda: NodeJSLambdaFunction

  public readonly integration: apigi.HttpLambdaIntegration

  constructor(scope: Construct, id: string, props: APIMicroserviceProps) {
    super(scope, id)

    this.apiPath = props.apiPath
    this.path = props.path
    this.methods = props.methods

    this.serviceLambda = new NodeJSLambdaFunction(this, 'ServiceLambda', {
      entry: props.path,
      handler: props.handler || 'handler',
      isProduction: props.contextEnvironment.isProduction,
      loggingLevel: props.contextEnvironment.isProduction ? 'ERROR' : 'DEBUG',
    })

    this.integration = new apigi.HttpLambdaIntegration('ServiceIntegration', this.serviceLambda)
  }

  public addEnvironment(key: string, value: string): void {
    this.serviceLambda.addEnvironment(key, value)
  }
}
