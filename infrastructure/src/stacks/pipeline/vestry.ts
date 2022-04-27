import 'source-map-support/register'

import { Stage, StageProps, Aspects } from 'aws-cdk-lib'
import { LambdaEnvironmentChecker } from '../../aspects'
import { ContextEnvironmentProps } from '../../common'
import { VestryStack } from '../vestry'
import { VestryCDNStack } from '../cdn'
import { Construct } from 'constructs'

export interface VestryStageProps extends StageProps, ContextEnvironmentProps {}

/**
 * Deployable unit of web service this
 */
export class VestryStage extends Stage {
  constructor(scope: Construct, id: string, props: VestryStageProps) {
    super(scope, id, props)

    const vestryStack = new VestryStack(this, 'Vestry', {
      description: 'Primary infrastructure stack for Vestry',
      env: {
        account: props.contextEnvironment.account,
        region: props.contextEnvironment.primaryRegion,
      },
      contextEnvironment: props.contextEnvironment,
    })

    new VestryCDNStack(this, 'VestryCDN', {
      description: 'CDN Stack for Vestry',
      env: {
        account: props.contextEnvironment.account,
        region: 'us-east-1', // CDN is always in us-east-1
      },
      contextEnvironment: props.contextEnvironment,
    })

    Aspects.of(vestryStack).add(new LambdaEnvironmentChecker())
  }
}
