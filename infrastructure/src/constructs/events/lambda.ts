import {
  Duration,
  aws_sqs as sqs,
  aws_events_targets as targets,
  aws_cloudwatch as cw,
  aws_cloudwatch_actions as cwActions,
  aws_events as events,
  aws_sns as sns,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { ContextEnvironmentProps } from '../../common'
import { NodeJSLambdaFunction } from '../lambda'
import { LogLevel } from '../../../../core/api/src'

export interface LambdaEventHandlerProps extends ContextEnvironmentProps {
  path: string
  handler?: string
  createDLQ: boolean
  addDLQAlarm: boolean
  topic?: sns.ITopic
  source: string[]
  eventBus: events.IEventBus
}

export class LambdaEventHandler extends Construct {
  public readonly lambdaFunction: NodeJSLambdaFunction

  constructor(scope: Construct, id: string, props: LambdaEventHandlerProps) {
    super(scope, id)

    this.lambdaFunction = new NodeJSLambdaFunction(this, 'StripeWebhookLambda', {
      entry: props.path,
      handler: props.handler || 'handler',
      isProduction: props.contextEnvironment.isProduction,
      loggingLevel: props.contextEnvironment.isProduction ? LogLevel.ERROR : LogLevel.DEBUG,
    })

    const rule = new events.Rule(this, 'rule', {
      eventPattern: {
        source: props.source,
      },
      eventBus: props.eventBus,
    })

    if (props.createDLQ) {
      const dlq = new sqs.Queue(this, 'EventDLQ')
      rule.addTarget(
        new targets.LambdaFunction(this.lambdaFunction, {
          deadLetterQueue: dlq,
          maxEventAge: Duration.hours(24),
          retryAttempts: 4,
        }),
      )

      if (props.addDLQAlarm && props.topic) {
        new cw.Alarm(this, `DLQAlarm`, {
          metric: dlq.metricApproximateNumberOfMessagesVisible(),
          evaluationPeriods: 1,
          datapointsToAlarm: 1,
          comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          actionsEnabled: true,
          threshold: 0,
        }).addAlarmAction(new cwActions.SnsAction(props.topic))
      }
    } else {
      rule.addTarget(new targets.LambdaFunction(this.lambdaFunction))
    }
  }
}
