"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthylinkxStack = void 0;
const cdk = require("aws-cdk-lib");
const rds = require("aws-cdk-lib/aws-rds");
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_secretsmanager_1 = require("aws-cdk-lib/aws-secretsmanager");
class HealthylinkxStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        //default VPC
        const vpc = ec2.Vpc.fromLookup(this, "VPC", {
            isDefault: true,
        });
        /*// Security group for the RDS instance
        const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
          vpc,
          description: "MySQL Sec Group'",
          allowAllOutbound: true,
        });
    
        // Allow access on port tcp/3306
        securityGroup.addIngressRule(
          ec2.Peer.anyIpv4(),
          ec2.Port.tcp(3306),
          "Allow MySQL port Access"
        );*/
        // create database master user secret and store it in Secrets Manager
        const masterUserSecret = new aws_secretsmanager_1.Secret(this, "db-master-user-secret", {
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
            //securityGroups: [securityGroup],
            engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0 }),
            allocatedStorage: 2,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            databaseName: "healthylinkx",
            credentials: rds.Credentials.fromSecret(masterUserSecret),
            backupRetention: cdk.Duration.days(0), // disable automatic DB snapshot retention
            deleteAutomatedBackups: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        // DB connection settings will be appended to this secret (host, port, etc.)
        masterUserSecret.attach(dbInstance);
    }
}
exports.HealthylinkxStack = HealthylinkxStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoeWxpbmt4LXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVhbHRoeWxpbmt4LXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUVuQywyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLHVFQUF3RDtBQUV4RCxNQUFhLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsYUFBYTtRQUNiLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDMUMsU0FBUyxFQUFFLElBQUk7U0FDaEIsQ0FBQyxDQUFDO1FBRUg7Ozs7Ozs7Ozs7OztZQVlJO1FBRUoscUVBQXFFO1FBQ3JFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSwyQkFBTSxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUNqRSxVQUFVLEVBQUUsdUJBQXVCO1lBQ25DLFdBQVcsRUFBRSxrQ0FBa0M7WUFDL0Msb0JBQW9CLEVBQUU7Z0JBQ3BCLG9CQUFvQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7Z0JBQzFELGlCQUFpQixFQUFFLFVBQVU7Z0JBQzdCLGNBQWMsRUFBRSxFQUFFO2dCQUNsQixrQkFBa0IsRUFBRSxJQUFJO2FBQ3pCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsOEJBQThCO1FBQzlCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNuRSxHQUFHLEVBQUUsR0FBRztZQUNSLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNqRCxrQ0FBa0M7WUFDbEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBQyxDQUFDO1lBQ25GLGdCQUFnQixFQUFFLENBQUM7WUFDbkIsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQy9FLFlBQVksRUFBRSxjQUFjO1lBQzVCLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUN6RCxlQUFlLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsMENBQTBDO1lBQ2pGLHNCQUFzQixFQUFFLElBQUk7WUFDNUIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUM7UUFFSCw0RUFBNEU7UUFDNUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXRDLENBQUM7Q0FDRjtBQXRERCw4Q0FzREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyByZHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXJkcyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgeyBTZWNyZXQgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXNlY3JldHNtYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBIZWFsdGh5bGlua3hTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vZGVmYXVsdCBWUENcbiAgICBjb25zdCB2cGMgPSBlYzIuVnBjLmZyb21Mb29rdXAodGhpcywgXCJWUENcIiwge1xuICAgICAgaXNEZWZhdWx0OiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLyovLyBTZWN1cml0eSBncm91cCBmb3IgdGhlIFJEUyBpbnN0YW5jZVxuICAgIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgXCJTZWN1cml0eUdyb3VwXCIsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk15U1FMIFNlYyBHcm91cCdcIixcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBBbGxvdyBhY2Nlc3Mgb24gcG9ydCB0Y3AvMzMwNlxuICAgIHNlY3VyaXR5R3JvdXAuYWRkSW5ncmVzc1J1bGUoXG4gICAgICBlYzIuUGVlci5hbnlJcHY0KCksXG4gICAgICBlYzIuUG9ydC50Y3AoMzMwNiksXG4gICAgICBcIkFsbG93IE15U1FMIHBvcnQgQWNjZXNzXCJcbiAgICApOyovXG4gICAgXG4gICAgLy8gY3JlYXRlIGRhdGFiYXNlIG1hc3RlciB1c2VyIHNlY3JldCBhbmQgc3RvcmUgaXQgaW4gU2VjcmV0cyBNYW5hZ2VyXG4gICAgY29uc3QgbWFzdGVyVXNlclNlY3JldCA9IG5ldyBTZWNyZXQodGhpcywgXCJkYi1tYXN0ZXItdXNlci1zZWNyZXRcIiwge1xuICAgICAgc2VjcmV0TmFtZTogXCJkYi1tYXN0ZXItdXNlci1zZWNyZXRcIixcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkRhdGFiYXNlIG1hc3RlciB1c2VyIGNyZWRlbnRpYWxzXCIsXG4gICAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzoge1xuICAgICAgICBzZWNyZXRTdHJpbmdUZW1wbGF0ZTogSlNPTi5zdHJpbmdpZnkoeyB1c2VybmFtZTogXCJyb290XCIgfSksXG4gICAgICAgIGdlbmVyYXRlU3RyaW5nS2V5OiBcInBhc3N3b3JkXCIsXG4gICAgICAgIHBhc3N3b3JkTGVuZ3RoOiAxNixcbiAgICAgICAgZXhjbHVkZVB1bmN0dWF0aW9uOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIGNyZWF0ZSBSRFMgaW5zdGFuY2UgKE15U1FMKVxuICAgIGNvbnN0IGRiSW5zdGFuY2UgPSBuZXcgcmRzLkRhdGFiYXNlSW5zdGFuY2UodGhpcywgXCJoZWFsdGh5bGlua3gtZGJcIiwge1xuICAgICAgdnBjOiB2cGMsXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgICAgLy9zZWN1cml0eUdyb3VwczogW3NlY3VyaXR5R3JvdXBdLFxuICAgICAgZW5naW5lOiByZHMuRGF0YWJhc2VJbnN0YW5jZUVuZ2luZS5teXNxbCh7dmVyc2lvbjogcmRzLk15c3FsRW5naW5lVmVyc2lvbi5WRVJfOF8wfSksXG4gICAgICBhbGxvY2F0ZWRTdG9yYWdlOiAyLFxuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlQyLCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKSxcbiAgICAgIGRhdGFiYXNlTmFtZTogXCJoZWFsdGh5bGlua3hcIixcbiAgICAgIGNyZWRlbnRpYWxzOiByZHMuQ3JlZGVudGlhbHMuZnJvbVNlY3JldChtYXN0ZXJVc2VyU2VjcmV0KSxcbiAgICAgIGJhY2t1cFJldGVudGlvbjogY2RrLkR1cmF0aW9uLmRheXMoMCksIC8vIGRpc2FibGUgYXV0b21hdGljIERCIHNuYXBzaG90IHJldGVudGlvblxuICAgICAgZGVsZXRlQXV0b21hdGVkQmFja3VwczogdHJ1ZSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICAvLyBEQiBjb25uZWN0aW9uIHNldHRpbmdzIHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhpcyBzZWNyZXQgKGhvc3QsIHBvcnQsIGV0Yy4pXG4gICAgbWFzdGVyVXNlclNlY3JldC5hdHRhY2goZGJJbnN0YW5jZSk7XG5cbiAgfVxufVxuIl19