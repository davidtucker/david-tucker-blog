import { pipelines, aws_codebuild as codebuild } from 'aws-cdk-lib'
import { VestryEnvironment } from '../../common'
import { VestryStage } from './vestry'

import { Construct } from 'constructs'
import * as cdk from 'aws-cdk-lib'

export class VestryPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      crossAccountKeys: true,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection('Vestry-io/vestry-stack', 'main', {
          connectionArn:
            'arn:aws:codestar-connections:us-east-2:242418079756:connection/f64ebc48-db78-4b57-8264-5069abc28e90',
        }),
        commands: ['yarn install --frozen-lockfile', 'cd infrastructure', 'npx cdk synth'],
        primaryOutputDirectory: 'infrastructure/cdk.out',
      }),
      dockerEnabledForSynth: true,
    })

    const testingStep = new pipelines.CodeBuildStep('TestAndCoverage', {
      commands: ['yarn install --frozen-lockfile', 'yarn test'],
      partialBuildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        reports: {
          'unit-tests': {
            files: ['test-reports/unit-tests/junit.xml'],
            'file-format': 'JUNITXML',
          },
          'code-coverage': {
            files: ['test-reports/coverage/clover.xml'],
            'file-format': 'CLOVERXML',
          },
        },
      }),
    })

    const stagingEnv: VestryEnvironment = VestryEnvironment.fromContext(this.node, 'staging')

    pipeline.addStage(
      new VestryStage(this, 'Staging', {
        contextEnvironment: stagingEnv,
      }),
      {
        pre: [testingStep],
      },
    )

    pipeline.buildPipeline()
  }
}
