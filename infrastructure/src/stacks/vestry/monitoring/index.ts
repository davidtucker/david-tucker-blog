import { NestedStack, NestedStackProps, aws_sns as sns } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { ContextEnvironmentProps } from '../../../common'

export interface MonitoringNestedStackProps extends NestedStackProps, ContextEnvironmentProps {}

export class MonitoringNestedStack extends NestedStack {
  public readonly topic: sns.ITopic

  constructor(scope: Construct, id: string, props: MonitoringNestedStackProps) {
    super(scope, id, props)

    // Topic -------------------------------------------------------------

    this.topic = new sns.Topic(this, 'AlertingTopic', {
      displayName: 'Vestry Alerting Topic',
    })
  }
}
