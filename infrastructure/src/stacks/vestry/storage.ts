import { Construct } from 'constructs'
import { NestedStack, aws_s3 as s3 } from 'aws-cdk-lib'

export class StorageNestedStack extends NestedStack {
  public readonly exemptionBucket: s3.IBucket

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.exemptionBucket = new s3.Bucket(this, 'ExemptionBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
    })
  }
}
