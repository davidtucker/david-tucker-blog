#!/usr/bin/env node
import 'source-map-support/register'

import { App } from 'aws-cdk-lib'
import { VestryEnvironment, SharedServicesEnvironment } from '../common'
import { VestryCDNStack } from '../stacks/cdn'
import { VestryStack } from '../stacks/vestry'
import { VestryPipelineStack } from '../stacks/pipeline'

const app = new App()

const contextEnvironment: VestryEnvironment = VestryEnvironment.hasLocal()
  ? VestryEnvironment.fromLocal()
  : VestryEnvironment.fromContext(app.node, app.node.tryGetContext('environment'))

new VestryCDNStack(app, 'VestryCDN', {
  env: {
    account: contextEnvironment.account,
    region: 'us-east-1',
  },
  contextEnvironment,
})

new VestryStack(app, 'VestryStack', {
  env: {
    account: contextEnvironment.account,
    region: contextEnvironment.primaryRegion,
  },
  contextEnvironment,
})

const pipelineContextEnvironment = SharedServicesEnvironment.fromContext(app.node)

new VestryPipelineStack(app, 'VestryPipeline', {
  env: {
    account: pipelineContextEnvironment.account,
    region: pipelineContextEnvironment.region,
  },
})

app.synth()
