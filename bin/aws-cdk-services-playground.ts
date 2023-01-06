#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { AwsCdkServicesPlaygroundStack } from "../lib/aws-cdk-services-playground-stack"
import { AwsCdkLambdaService } from "../lib/aws-cdk-lambda-service-stack"

const app = new cdk.App()
new AwsCdkServicesPlaygroundStack(app, "aws-cdk-services-playground-stack", {})
new AwsCdkLambdaService(app, "aws-cdk-lambda-playground-stack", {})
