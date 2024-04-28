#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HealthylinkxStack } from './healthylinkx-stack';

const app = new cdk.App();

new HealthylinkxStack(app, 'HealthylinkxStack', {

  env: { account: process.env.AWS_ACCOUNT_ID, region: process.env.AWS_DEFAULT_REGION },

});