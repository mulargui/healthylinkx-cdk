import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';


export class HealthylinkxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //default VPC
    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true,
    });

    // Security group for the RDS instance
    const securityGroup = new ec2.SecurityGroup(this, "MySQLSecurityGroup", {
      vpc,
      description: "MySQLSecurityGroup",
      allowAllOutbound: true,
    });

    // Allow access on port tcp/3306
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3306),
      "Allow-MySQL-port-Access"
    );
    
    // create database master user secret and store it in Secrets Manager
    const masterUserSecret = new Secret(this, "db-master-user-secret", {
      secretName: "db-master-user-secret",
      description: "Database master user credentials",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "root" }),
        generateStringKey: "password",
        passwordLength: 16,
        excludePunctuation: true,
      },
    });

    // create RDS instance (MySQL)
    const dbInstance = new rds.DatabaseInstance(this, "healthylinkx-db", {
      vpc: vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      securityGroups: [securityGroup],
      engine: rds.DatabaseInstanceEngine.mysql({version: rds.MysqlEngineVersion.VER_8_0}),
      allocatedStorage: 6,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      databaseName: "healthylinkx",
      credentials: rds.Credentials.fromSecret(masterUserSecret),
      backupRetention: cdk.Duration.days(0), // disable automatic DB snapshot retention
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Define the Lambda function resource
    const healthylinkxFunction = new lambda.Function(this, 'healthylinkxFunction', {
      runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
      code: lambda.Code.fromAsset('api/src'), // Points to the lambda directory
      handler: 'index.handler', // Points to the index file in the lambda directory
    });

    // give the lambda function access to the DBSecrets
    masterUserSecret.grantRead(healthylinkxFunction.role!);

    // Define the API Gateway resource
    const api = new apigateway.LambdaRestApi(this, 'HealthylinkxApi', {
      handler: healthylinkxFunction,
      proxy: false,
    });
        
    // Define the '/hello' resource with a GET method
    const helloResource = api.root.addResource('hello');
    helloResource.addMethod('GET');
  }
}
