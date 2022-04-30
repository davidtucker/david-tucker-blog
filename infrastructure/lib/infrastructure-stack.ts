import { Stack, StackProps, aws_certificatemanager as acm, } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudFrontWebsite } from '../constructs/web'
import * as path from 'path'

export class BlogStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CloudFrontWebsite(this, 'MainWebApp', {
      aliases: ['www.davidtucker.net'],
      relativePath: 'site',
      redirectWWW: true,
      baseDirectory: path.join(__dirname, '..', '..'),
      outputDirectory: '_site',
      buildCommands: [ 
        'yarn build' 
      ],
      certificateARN: 'arn:aws:acm:us-east-1:423026013464:certificate/3e2b36e3-a8a5-492e-b677-734afd5d5c7d',
      domain: `davidtucker.net`
    })

  }
}
