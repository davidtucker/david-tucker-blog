import {
  Duration,
  aws_route53 as route53,
  aws_ssm as ssm,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambdaNode,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as cdk from 'aws-cdk-lib'

import { referenceFromRootDirectory } from '../../common'

interface GoDaddyUpdateNameserversProps {
  hostedZone: route53.IHostedZone
  domainName: string
}

export class GoDaddyUpdateNameServers extends Construct {
  constructor(scope: Construct, id: string, props: GoDaddyUpdateNameserversProps) {
    super(scope, id)

    const goDaddyLambda = new lambdaNode.NodejsFunction(this, 'GoDaddyLambda', {
      entry: referenceFromRootDirectory('lambda/cfn/godaddy/src/index.ts'),
      handler: 'handler',
      timeout: Duration.seconds(60),
      runtime: lambda.Runtime.NODEJS_12_X,
    })

    new cdk.CustomResource(this, 'GoDaddyResource', {
      serviceToken: goDaddyLambda.functionArn,
      properties: {
        Domain: props.domainName,
        GoDaddyKey: ssm.StringParameter.valueForStringParameter(this, 'godaddy_key', 1),
        GoDaddySecret: ssm.StringParameter.valueForStringParameter(this, 'godaddy_secret', 1),
        NameServers: props.hostedZone.hostedZoneNameServers as string[],
      },
    })
  }
}
