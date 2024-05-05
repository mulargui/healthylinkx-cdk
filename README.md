# healthylinkx-cdk

Healthylinkx helps you find doctors with the help of your social network. Think of Healthylinkx as a combination of Yelp, Linkedin and Facebook. 

This is an early prototype that combines open data of doctors and specialists from the US Department of Health. It allows you to search for doctors based on location, specialization, genre or name. You can choose up to three doctors in the result list and Healthylinkx (theoretically) will book appointments for you.

Healthylinx is a classic three tiers app: front-end (ux), service API and data store. This architecture makes it very adequate to test different technologies and I use it for getting my hands dirty on new stuff. This is a remake of Healthylinkx using AWS CDK. This repo implements Healthylinkx using AWS serverless resources (S3, Lmbda, APIGateway, CLoudFront, SecretsManager, RDS MySQL). Based on https://github.com/mulargui/healthylinkx-serverless-node. Enjoy!

To use this repo you just need git (to clone this repo) and docker. In order to access AWS you need to have environment variables with your credentials. Look at AWS documentation for the different ways to share credentials. Use something like \
export AWS_ACCESS_KEY_ID=1234567890 \
export AWS_SECRET_ACCESS_KEY=ABCDEFGHIJKLMN \
export AWS_ACCOUNT_ID=1234567890 \
export AWS_DEFAULT_REGION=us-east-1 \
export AWS_REGION=$AWS_DEFAULT_REGION

AWS CDK requires to bootstrap your account before you can deploy your app, look at the AWS documentation for more details. Healthylinkx-cli has an option to run bootstrapping.

Directories and files  
/healthylinkx-cli.sh - this is the command line interface to bootstrap, create and destroy the healthylinkx app. It runs a container that has all the dependencies needed so you don't need to install anything. \
/docker - dockerfile wiht dependencies needed to run everything in a container. \
/cdk/src - AWS CDK code (typescript) to deploy or destroy the app in your AWS account.

The API is implemented as Lambdas written in nodejs and hosted in APIGateway. \
/api/src - source code of the api (node js) - one file per endpoint. \
/api/test - shellscript to test the endpoints from a command line. 

The datastore is a RDS MySql instance. \
/datastore/data - dump of the healthylinkx database (schema and data).

The ux is a single page web app (html+jquery+bootstrap+javascript) hosted in a S3 bucket and CloudFront. \
/ux/src - the source code of the ux app.

Notes:
I couldn't automate everything. I could do some hacks but didn't want.
1) AWS CDK doesn't give you a good mechanism to populate a MySql database (there is one for Postgress). The recommended way is to create a lambda to execute the load, doesn't look great. I ended up running a simple script from the command line (healthylinkx-cli i). The downside of this approach is that I needed to make the database available over the internet (public). 
```
cd /datastore/data
mysql -u root -p<password> -h <dbendpoint.rds.amazonaws.com> healthylinkx < healthylinkxdump.sql
```
User, password and rds endpoint can be obtained in the AWS console>>SecretsManager. \
2) The UX needs the URL of the API endpoints in /ux/src/js/constants.js I could automate it, pending for the future. After completing the deployment, I got the URL from the AWS console>>APIGateway, edited the file and did a new deployment. \
3) /api/test/test.sh also needs the URL of the endpoints. I also edited by hand before running the tests.
