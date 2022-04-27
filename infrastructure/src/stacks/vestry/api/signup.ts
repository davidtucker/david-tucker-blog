import { aws_s3 as s3, aws_ssm as ssm, aws_iam as iam, aws_dynamodb as ddb, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as apigv2 from '@aws-cdk/aws-apigatewayv2-alpha'
import { referenceFromRootDirectory } from '../../../common/files'
import { APIMicroservice, APIService, APIServiceProps } from '../../../constructs/api/service'

export interface SignupServiceProps extends APIServiceProps {
  exemptionBucket: s3.IBucket
  dynamoDBTable: ddb.ITable
}

export class SignupService extends APIService {
  constructor(scope: Construct, id: string, props: SignupServiceProps) {
    super(scope, id, props)

    const stack = Stack.of(this)

    // -------------------------------------------------------------------
    // /signup/checkout-status
    // GET

    const checkoutStatus = new APIMicroservice(this, 'CheckoutStatus', {
      apiPath: '/signup/checkout-status',
      methods: [apigv2.HttpMethod.GET],
      contextEnvironment: props.contextEnvironment,
      path: referenceFromRootDirectory('lambda/api/signup/checkout-status/src/index.ts'),
    })

    // Environment Variables

    checkoutStatus.addEnvironment(
      'STRIPE_SECRET_KEY',
      ssm.StringParameter.valueForStringParameter(this, 'stripe_secret'),
    )

    this.addMicroservice(checkoutStatus)

    // -------------------------------------------------------------------
    // /signup/start-checkout
    // GET

    const startCheckout = new APIMicroservice(this, 'StartCheckout', {
      apiPath: '/signup/start-checkout',
      methods: [apigv2.HttpMethod.POST],
      contextEnvironment: props.contextEnvironment,
      path: referenceFromRootDirectory('lambda/api/signup/start-checkout/src/index.ts'),
    })

    startCheckout.addEnvironment(
      'STRIPE_SECRET_KEY',
      ssm.StringParameter.valueForStringParameter(this, 'stripe_secret'),
    )

    // Environment Variables

    startCheckout.addEnvironment('DYNAMODB_TABLE', props.dynamoDBTable.tableName)
    startCheckout.addEnvironment('EXEMPTION_UPLOAD_BUCKET', props.exemptionBucket.bucketName)
    startCheckout.addEnvironment('DOMAIN_NAME', props.contextEnvironment.domain)

    // Permissions
    props.exemptionBucket.grantWrite(startCheckout.serviceLambda)
    props.dynamoDBTable.grantWriteData(startCheckout.serviceLambda)

    const ssmPolicy = new iam.PolicyStatement()
    ssmPolicy.addResources(
      `arn:aws:ssm:${props.contextEnvironment.primaryRegion}:${stack.account}:parameter/stripe_pricing`,
    )
    ssmPolicy.addActions('ssm:GetParameter')
    startCheckout.serviceLambda.addToRolePolicy(ssmPolicy)

    this.addMicroservice(startCheckout)
  }
}
