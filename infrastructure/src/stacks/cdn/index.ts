import { ContextEnvironmentProps, getProjectRootDirectory } from '../../common'
import { CloudFrontWebApplication, CloudFrontReactErrorConfiguration } from '../../constructs/web/site'
import { Construct } from 'constructs'
import {
  aws_wafv2 as waf,
  aws_route53 as route53,
  aws_certificatemanager as acm,
  StackProps,
  Stack,
  CfnOutput,
} from 'aws-cdk-lib'

interface CDNStackProps extends StackProps, ContextEnvironmentProps {}

export class VestryCDNStack extends Stack {
  constructor(scope: Construct, id: string, props: CDNStackProps) {
    super(scope, id, props)

    if (this.region !== 'us-east-1') {
      throw new Error('The CDN Stack is required to be in us-east-1 due to CloudFront needs')
    }

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.contextEnvironment.domain,
    })

    let acl
    if (props.contextEnvironment.allowedIPRanges && !props.contextEnvironment.isProduction) {
      const ipSet = new waf.CfnIPSet(this, 'DevelopmentIPSet', {
        addresses: props.contextEnvironment.allowedIPRanges,
        ipAddressVersion: 'IPV4',
        name: `DevelopmentIPSet`,
        scope: 'CLOUDFRONT',
      })

      acl = new waf.CfnWebACL(this, 'CloudFrontACL', {
        defaultAction: {
          block: {},
        },
        scope: 'CLOUDFRONT',
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: 'waf',
          sampledRequestsEnabled: false,
        },
        rules: [
          {
            name: 'LimitIPAccessForDevelopmentEnvironment',
            action: { allow: {} },
            priority: 1,
            visibilityConfig: {
              sampledRequestsEnabled: true,
              cloudWatchMetricsEnabled: true,
              metricName: 'IPSetMetric',
            },
            statement: {
              ipSetReferenceStatement: {
                arn: ipSet.attrArn,
              },
            },
          },
        ],
      })

      acl.addDependsOn(ipSet)
    }

    const certificate = new acm.DnsValidatedCertificate(this, 'CDNCertificate', {
      domainName: props.contextEnvironment.domain,
      subjectAlternativeNames: [`${props.contextEnvironment.domain}`, `*.${props.contextEnvironment.domain}`],
      hostedZone,
    })

    // WebApp and Output -------------------------------------------------

    new CloudFrontWebApplication(this, 'MainWebApp', {
      relativePath: 'webapps/app',
      baseDirectory: getProjectRootDirectory(),
      outputDirectory: 'build',
      buildCommands: ['yarn build'],
      certificateARN: certificate.certificateArn,
      domain: `app.${props.contextEnvironment.domain}`,
      hostedZone,
      cloudFrontConfig: CloudFrontReactErrorConfiguration,
      acl,
    })

    new CfnOutput(this, 'VestryAppURL', {
      value: `https://app.${props.contextEnvironment.domain}/`,
      exportName: 'VestryAppURL',
    })

    new CloudFrontWebApplication(this, 'MainSite', {
      relativePath: 'sites/main',
      baseDirectory: getProjectRootDirectory(),
      outputDirectory: 'dist',
      buildCommands: ['yarn build'],
      certificateARN: certificate.certificateArn,
      domain: `${props.contextEnvironment.domain}`,
      aliases: [`www.${props.contextEnvironment.domain}`],
      buildEnvironment: {
        API_ENDPOINT: `https://api.${props.contextEnvironment.domain}`,
        APP_URL: `https://app.${props.contextEnvironment.domain}`,
      },
      cloudFrontConfig: {
        errorConfigurations: [
          {
            errorCachingMinTtl: 86400,
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/404/index.html',
          },
        ],
      },
      redirectWWW: true,
      hostedZone,
      acl,
    })

    new CfnOutput(this, 'VestrySiteURL', {
      value: `https://${props.contextEnvironment.domain}/`,
      exportName: 'VestrySiteURL',
    })
  }
}
