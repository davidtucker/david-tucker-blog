import * as path from 'path'
import { Construct } from 'constructs'
import {
  aws_cloudfront as cloudfront,
  aws_wafv2 as waf,
  aws_s3 as s3,
  aws_s3_deployment as s3Deploy,
  DockerImage,
  aws_certificatemanager as acm,
  CfnOutput,
} from 'aws-cdk-lib'

interface ReactWebAppProps {
  relativePath: string
  baseDirectory: string
  outputDirectory: string
  certificateARN: string
  domain: string
  aliases?: string[]
  acl?: waf.CfnWebACL
  buildEnvironment?: {
    [key: string]: string
  }
  buildCommands?: string[]
  cloudFrontConfig?: Partial<cloudfront.CloudFrontWebDistributionProps>
  distributionFunction?: cloudfront.Function
  redirectWWW?: boolean
}

export const CloudFrontReactErrorConfiguration: Partial<cloudfront.CloudFrontWebDistributionProps> = {
  errorConfigurations: [
    {
      errorCachingMinTtl: 86400,
      errorCode: 403,
      responseCode: 200,
      responsePagePath: '/index.html',
    },
    {
      errorCachingMinTtl: 86400,
      errorCode: 404,
      responseCode: 200,
      responsePagePath: '/index.html',
    },
  ],
}

export class CloudFrontWebsite extends Construct {
  public readonly webDistribution: cloudfront.CloudFrontWebDistribution

  public readonly hostingBucket: s3.IBucket

  constructor(scope: Construct, id: string, props: ReactWebAppProps) {
    super(scope, id)

    this.hostingBucket = new s3.Bucket(this, 'WebHostingBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
    })

    const dockerOutput = path.join('/', 'asset-input', props.relativePath, props.outputDirectory)

    const oai = new cloudfront.OriginAccessIdentity(this, 'WebHostingOAI', {})

    const certificate = acm.Certificate.fromCertificateArn(this, 'APICertificate', props.certificateARN)

    const aliases = props.aliases || []

    const functionAssociations = []

    if (props.redirectWWW) {
      const cfFunction = new cloudfront.Function(this, 'RedirectFunction', {
        code: cloudfront.FunctionCode.fromInline(`function handler(event) {
          var request = event.request;
          var uri = request.uri;
          var host = request.headers.host.value;
          // Check if trying to use www domain
          if(host.startsWith("www.")) {
            var newURL = 'https://' + host.slice(4) + uri;
            var response = {
              statusCode: 301,
              statusDescription: 'Moved Permanently',
              headers:
                  { "location": { "value": newURL } }
            }
            return response;
          }
          // Check whether the URI is missing a file name.
          if (uri.endsWith('/')) {
              request.uri += 'index.html';
          }
          // Check whether the URI is missing a file extension.
          else if (!uri.includes('.')) {
              request.uri += '/index.html';
          }
          return request;
        }`),
        comment: 'Redirects www. to root domain',
      })

      functionAssociations.push({
        function: cfFunction,
        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
      })
    }

    const defaultCloudFrontProps: any = {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: this.hostingBucket,
            originAccessIdentity: oai,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              functionAssociations,
            },
          ],
        },
      ],
      viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [`${props.domain}`, ...aliases],
      }),
    }

    // If ACL is present, set it on CF distribution
    if (props.acl) {
      defaultCloudFrontProps.webACLId = props.acl.attrArn
    }

    // Merge props and default config
    const cloudFrontProps = {
      ...defaultCloudFrontProps,
      ...props.cloudFrontConfig,
    }

    // CloudFront Web Distribution ---------------------------------------

    this.webDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'WebHostingDistribution',
      cloudFrontProps,
    )

    this.hostingBucket.grantRead(oai)

    // Build Process -----------------------------------------------------

    const getDockerBuildCommand = (): string[] => {
      let command = `cd ${props.relativePath}`
      if (props.buildCommands) {
        command = `${command} && ${props.buildCommands.join('&&')}`
      }
      command = `${command} && cp -r ${dockerOutput}/* /asset-output/`
      return ['sh', '-c', command]
    }

    const source = s3Deploy.Source.asset(props.baseDirectory, {
      bundling: {
        image: DockerImage.fromRegistry('public.ecr.aws/docker/library/node:18'),
        command: getDockerBuildCommand(),
        environment: props.buildEnvironment,
      },
    })

    // Deployment --------------------------------------------------------

    new s3Deploy.BucketDeployment(this, 'WebAppDeploy', {
      distribution: this.webDistribution,
      distributionPaths: ['/*'],
      sources: [source],
      destinationBucket: this.hostingBucket,
    })

    // Outputs -----------------------------------------------------------

    new CfnOutput(this, 'DTBlogURL', {
      value: this.webDistribution.distributionDomainName,
      exportName: 'DTBlogURL',
    })

  }
}
