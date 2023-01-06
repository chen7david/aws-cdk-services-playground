import { Stack, StackProps } from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

export class AwsCdkLambdaDbService extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    /* create dynamodb service */
    const itemsTable = new dynamodb.Table(this, 'aws-dynamodb-playground', {
      partitionKey: {
        name: 'itemId',
        type: dynamodb.AttributeType.STRING
      }
    })

    /* create lambda service */
    const getAllItemsLambda = new lambda.Function(
      this,
      'get-all-items-lambda',
      {
        functionName: 'get-all-items-from-db-lambda',
        code: new lambda.AssetCode('src/handlers'),
        handler: 'get-all-items-from-db.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        environment: {
          TABLE_NAME: itemsTable.tableName,
          PRIMARY_KEY: 'itemId'
        }
      }
    )

    itemsTable.grantReadData(getAllItemsLambda)

    /* create api-gateway service */
    const apiGateway = new apigateway.RestApi(this, 'apigateway', {
      restApiName: 'aws-apigateway-items-playground'
    })

    const apiRoot = apiGateway.root.addResource('root')

    const getAllIApiIntegrationLambda = new apigateway.LambdaIntegration(
      getAllItemsLambda
    )

    apiRoot.addMethod('GET', getAllIApiIntegrationLambda)

    /* add rate-limiting to api-gateway service */
    const plan = apiGateway.addUsagePlan('playground-api-gateway-usage-plan', {
      name: 'playground-usage-items-plan',
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
