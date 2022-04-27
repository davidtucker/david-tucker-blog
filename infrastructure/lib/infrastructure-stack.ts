import { Stack, StackProps, aws_certificatemanager as acm, } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudFrontWebsite } from '../constructs/web'
import * as path from 'path'

export class BlogStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CloudFrontWebsite(this, 'MainWebApp', {
      relativePath: 'webapps/app',
      redirectWWW: true,
      baseDirectory: path.join(__dirname, '..', '..', 'site'),
      outputDirectory: '_site',
      buildCommands: ['yarn build'],
      certificateARN: 'ARN',
      domain: `davidtucker.net`
    })

  }
}
