import { Construct } from 'constructs'
import { aws_events as eb, aws_ssm as ssm } from 'aws-cdk-lib'
import * as apigv2 from '@aws-cdk/aws-apigatewayv2-alpha'
import { referenceFromRootDirectory } from '../../../common/files'
import { APIMicroservice, APIService, APIServiceProps } from '../../../constructs/api/service'

export interface WebhookServiceProps extends APIServiceProps {
  applicationBus: eb.IEventBus
}

export class WebhookService extends APIService {
  constructor(scope: Construct, id: string, props: WebhookServiceProps) {
    super(scope, id, props)

    // -------------------------------------------------------------------
    // /webhook/stripe
    // POST

    const stripeWebhook = new APIMicroservice(this, 'StripeWebhook', {
      apiPath: '/webhooks/stripe',
      methods: [apigv2.HttpMethod.POST],
      contextEnvironment: props.contextEnvironment,
      path: referenceFromRootDirectory('lambda/api/webhooks/stripe/src/index.ts'),
    })

    props.applicationBus.grantPutEventsTo(stripeWebhook.serviceLambda)

    stripeWebhook.addEnvironment(
      'STRIPE_SECRET_KEY',
      ssm.StringParameter.valueForStringParameter(this, 'stripe_secret'),
    )

    stripeWebhook.addEnvironment(
      'STRIPE_WEBHOOK_ENDPOINT_SECRET',
      ssm.StringParameter.valueForStringParameter(this, 'stripe_webhook_secret'),
    )

    stripeWebhook.addEnvironment('APP_BUS_NAME', props.applicationBus.eventBusName)

    this.addMicroservice(stripeWebhook)
  }
}
