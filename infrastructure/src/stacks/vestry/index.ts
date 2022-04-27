import { Stack, StackProps, aws_certificatemanager as acm } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { ContextEnvironmentProps } from '../../common'
import { APINestedStack } from './api'
import { StorageNestedStack } from './storage'
import { DatabaseNestedStack } from './database'
import { EventsNestedStack } from './events'
import { MonitoringNestedStack } from './monitoring'
import { DomainStack } from './domain'

interface VestryStackProps extends StackProps, ContextEnvironmentProps {}

export class VestryStack extends Stack {
  constructor(scope: Construct, id: string, props: VestryStackProps) {
    super(scope, id, props)

    const domain = new DomainStack(this, 'Domain', {
      contextEnvironment: props.contextEnvironment,
    })

    const monitoring = new MonitoringNestedStack(this, 'Monitoring', {
      contextEnvironment: props.contextEnvironment,
    })

    const database = new DatabaseNestedStack(this, 'Database', {
      contextEnvironment: props.contextEnvironment,
    })

    const events = new EventsNestedStack(this, 'Events', {
      contextEnvironment: props.contextEnvironment,
      topic: monitoring.topic,
      databaseTable: database.table,
    })

    // Certificate
    const certificate = new acm.DnsValidatedCertificate(this, 'AppCertificate', {
      domainName: props.contextEnvironment.domain,
      subjectAlternativeNames: [`*.${props.contextEnvironment.domain}`],
      hostedZone: domain.hostedZone,
    })

    const storage = new StorageNestedStack(this, 'Storage')

    new APINestedStack(this, 'API', {
      domainName: props.contextEnvironment.domain,
      certificateARN: certificate.certificateArn,
      hostedZone: domain.hostedZone,
      contextEnvironment: props.contextEnvironment,
      exemptionBucket: storage.exemptionBucket,
      dynamoDBTable: database.table,
      applicationBus: events.applicationBus,
    })
  }
}
