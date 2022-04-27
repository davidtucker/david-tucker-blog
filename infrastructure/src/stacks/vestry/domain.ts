import { SESDomainVerifier } from '../../constructs/ses'
import { ContextEnvironmentProps } from '../../common'
import { Construct } from 'constructs'
import { NestedStack, NestedStackProps, aws_route53 as route53 } from 'aws-cdk-lib'

export interface DomainStackProps extends NestedStackProps, ContextEnvironmentProps {}

export class DomainStack extends NestedStack {
  public readonly hostedZone: route53.IHostedZone

  public readonly certificateARN: string

  constructor(scope: Construct, id: string, props: DomainStackProps) {
    super(scope, id, props)

    this.hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.contextEnvironment.domain,
    })

    // SES Validator
    const sesVerifier = new SESDomainVerifier(this, 'SESDomainVerifier', {
      hostedZone: this.hostedZone,
    })
    sesVerifier.node.addDependency(this.hostedZone)
  }
}
