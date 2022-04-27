import {
  NestedStackProps,
  NestedStack,
  aws_sns as sns,
  aws_ssm as ssm,
  aws_dynamodb as ddb,
  aws_events as events,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { ContextEnvironmentProps, referenceFromRootDirectory } from '../../../common'
import { LambdaEventHandler } from '../../../constructs/events/lambda'

export interface EventsNestedStackProps extends NestedStackProps, ContextEnvironmentProps {
  topic: sns.ITopic
  databaseTable: ddb.ITable
}

export class EventsNestedStack extends NestedStack {
  public readonly applicationBus: events.IEventBus

  constructor(scope: Construct, id: string, props: EventsNestedStackProps) {
    super(scope, id, props)

    // Application bus ---------------------------------------------------

    const reverseDNS = props.contextEnvironment.domain.split('.').reverse().join('.')

    this.applicationBus = new events.EventBus(this, 'AppEventBus', {
      eventBusName: `${reverseDNS}.app`,
    })

    // Rules -------------------------------------------------------------

    const stripeHandler = new LambdaEventHandler(this, 'StripeHandler', {
      path: referenceFromRootDirectory('lambda/events/stripe/src/index.ts'),
      source: ['com.stripe.webhook'],
      eventBus: this.applicationBus,
      createDLQ: true,
      addDLQAlarm: true,
      topic: props.topic,
      contextEnvironment: props.contextEnvironment,
    })

    stripeHandler.lambdaFunction.addEnvironment('DYNAMODB_TABLE', props.databaseTable.tableName)
    stripeHandler.lambdaFunction.addEnvironment('APP_BUS_NAME', this.applicationBus.eventBusName)
    stripeHandler.lambdaFunction.addEnvironment(
      'STRIPE_SECRET_KEY',
      ssm.StringParameter.valueForStringParameter(this, 'stripe_secret'),
    )
    props.databaseTable.grantWriteData(stripeHandler.lambdaFunction)
    this.applicationBus.grantPutEventsTo(stripeHandler.lambdaFunction)
  }
}
