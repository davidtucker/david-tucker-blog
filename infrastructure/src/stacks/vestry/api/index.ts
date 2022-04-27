import { ContextEnvironmentProps } from '../../../common'
import { SignupService } from './signup'
import { WebhookService } from './webhook'
import {
  NestedStack,
  NestedStackProps,
  CfnOutput,
  Duration,
  aws_route53 as route53,
  aws_s3 as s3,
  aws_dynamodb as ddb,
  aws_events as events,
  aws_certificatemanager as acm,
  aws_route53_targets as alias,
} from 'aws-cdk-lib'
import { DomainName, HttpApi, CorsHttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha'
import { Construct } from 'constructs'

export interface APINestedStackProps extends NestedStackProps, ContextEnvironmentProps {
  domainName: string
  certificateARN: string
  hostedZone: route53.IHostedZone
  exemptionBucket: s3.IBucket
  dynamoDBTable: ddb.ITable
  applicationBus: events.IEventBus
}

export class APINestedStack extends NestedStack {
  constructor(scope: Construct, id: string, props: APINestedStackProps) {
    super(scope, id, props)

    // Configure API Gateway ---------------------------------------------

    const apiDomainName = new DomainName(this, 'APIDomainName', {
      domainName: `api.${props.domainName}`,
      certificate: acm.Certificate.fromCertificateArn(this, 'APICertificate', props.certificateARN),
    })

    const httpApi = new HttpApi(this, 'HttpProxyApi', {
      apiName: 'vestry-api',
      createDefaultStage: true,
      defaultDomainMapping: {
        domainName: apiDomainName,
      },
      corsPreflight: {
        allowHeaders: ['Authorization', 'Content-Type', '*'],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.DELETE,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
        ],
        allowOrigins: ['http://*', 'https://*'],
        allowCredentials: true,
        maxAge: Duration.days(10),
      },
    })

    // Services ----------------------------------------------------------

    new SignupService(this, 'SignupService', {
      httpApi,
      base: '/signup',
      contextEnvironment: props.contextEnvironment,
      exemptionBucket: props.exemptionBucket,
      dynamoDBTable: props.dynamoDBTable,
    })

    new WebhookService(this, 'WebhookService', {
      httpApi,
      base: '/webhook',
      contextEnvironment: props.contextEnvironment,
      applicationBus: props.applicationBus,
    })

    // Route 53 ----------------------------------------------------------

    new route53.ARecord(this, 'DistributionRecord', {
      zone: props.hostedZone,
      recordName: `api.${props.domainName}`,
      target: route53.RecordTarget.fromAlias(
        new alias.ApiGatewayv2DomainProperties(
          apiDomainName.regionalDomainName,
          apiDomainName.regionalHostedZoneId,
        ),
      ),
    })

    // Outputs -----------------------------------------------------------

    if (httpApi.url) {
      new CfnOutput(this, 'VestryAPIEndpoint', {
        value: httpApi.url,
        exportName: 'VestryAPIEndpoint',
      })
    }
  }
}
