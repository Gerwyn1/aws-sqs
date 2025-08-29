import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambdaBase from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

export class FirstSqsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Producer Lambda (API Gateway -> SQS)
    const producerLambda = new NodejsFunction(this, "OrderProducer", {
      runtime: lambdaBase.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../src/lambda/handler.ts"),
      handler: "producer",
      functionName: `${this.stackName}-producer`,
    });

    // Create Consumer Lambda (SQS -> Processing)
    const consumerLambda = new NodejsFunction(this, "OrderConsumer", {
      runtime: lambdaBase.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../src/lambda/handler.ts"),
      handler: "consumer",
      functionName: `${this.stackName}-consumer`,
    });

    const api = new apigateway.RestApi(this, "OrdersApi");

    const orders = api.root.addResource("orders");
    orders.addMethod("POST", new apigateway.LambdaIntegration(producerLambda));

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url!,
    });
  }
}
