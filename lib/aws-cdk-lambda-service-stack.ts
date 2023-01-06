import { Stack, StackProps } from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

export class AwsCdkLambdaService extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    /* create lambda service */
    const getAllLambda = new lambda.Function(this, 'get-all-items-lambda', {
      functionName: 'get-all-items-lambda',
      code: new lambda.AssetCode('src/handlers'),
      handler: 'get-all-items.handler',
      runtime: lambda.Runtime.NODEJS_14_X
    })

    /* create api-gateway service */
    const apiGateway = new apigateway.RestApi(this, 'apigateway', {
      restApiName: 'aws-apigateway-playground'
    })

    const apiRoot = apiGateway.root.addResource('root')

    const getAllIApiIntegrationLambda = new apigateway.LambdaIntegration(
      getAllLambda
    )

    apiRoot.addMethod('GET', getAllIApiIntegrationLambda)

    /* add rate-limiting to api-gateway service */
    const plan = apiGateway.addUsagePlan('playground-api-gateway-usage-plan', {
      name: 'playground-usage-plan',
      throttle: {
        rateLimit: 1,
        burstLimit: 1
      }
    })

    /* require an apiKey for api-gateway service */
    const token = apiGateway.addApiKey('ApiKey')
    plan.addApiKey(token)
  }
}
