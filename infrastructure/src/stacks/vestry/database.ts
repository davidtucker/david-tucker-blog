import { aws_dynamodb as ddb, NestedStackProps, NestedStack } from 'aws-cdk-lib'
import { ContextEnvironmentProps } from '../../common'
import { Construct } from 'constructs'

interface DatabaseStackProps extends NestedStackProps, ContextEnvironmentProps {}

export class DatabaseNestedStack extends NestedStack {
  public readonly table: ddb.Table

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props)

    this.table = new ddb.Table(this, 'Table', {
      partitionKey: {
        name: 'PK',
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: ddb.AttributeType.STRING,
      },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      stream: ddb.StreamViewType.NEW_AND_OLD_IMAGES,
      timeToLiveAttribute: 'Expiration',
    })
  }
}
