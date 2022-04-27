// import * as lambda from '@aws-cdk/aws-lambda'
// import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
// import * as logs from '@aws-cdk/aws-logs'
// import * as route53 from '@aws-cdk/aws-route53'
// import * as iam from '@aws-cdk/aws-iam'
// import * as cdk from '@aws-cdk/core'
// import * as cr from '@aws-cdk/custom-resources'

import {
  Duration,
  aws_route53 as route53,
  aws_lambda_nodejs as lambdaNode,
  aws_lambda as lambda,
  aws_iam as iam,
  CustomResource,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { referenceFromRootDirectory } from '../../common'

interface SESDomainVerifierProps {
  hostedZone: route53.IHostedZone
}

export class SESDomainVerifier extends Construct {
  constructor(scope: Construct, id: string, props: SESDomainVerifierProps) {
    super(scope, id)

    const sesValidatorLambda = new lambdaNode.NodejsFunction(this, 'SESValidatorLambda', {
      entry: referenceFromRootDirectory('lambda/cfn/ses-validation/src/index.ts'),
      handler: 'handler',
      timeout: Duration.seconds(60),
      runtime: lambda.Runtime.NODEJS_12_X,
    })

    const lambdaCustomResourcePolicyStatement = new iam.PolicyStatement()
    lambdaCustomResourcePolicyStatement.addResources('*')
    lambdaCustomResourcePolicyStatement.addActions('route53:*', 'ses:*')

    sesValidatorLambda.addToRolePolicy(lambdaCustomResourcePolicyStatement)

    const sesValidationResource = new CustomResource(this, 'SESValidatorResource', {
      serviceToken: sesValidatorLambda.functionArn,
      properties: {
        HostedZoneId: props.hostedZone.hostedZoneId,
      },
    })

    sesValidationResource.node.addDependency(props.hostedZone)
  }
}
