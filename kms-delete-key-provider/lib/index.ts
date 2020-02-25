
import { Code, Runtime, SingletonFunction } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import { Key, KeyProps } from '@aws-cdk/aws-kms';
import path = require('path');
import uuid = require('uuid-random');

export interface KmsDeleteKeyProps extends KeyProps {
  deleteKeyOnDestroy?: boolean;
}

export class KmsDeleteKey extends Key {

  constructor(scope: cdk.Construct, id: string, props: KmsDeleteKeyProps = {}) {
    let keyProps = Object.assign({}, props);
    delete keyProps.deleteKeyOnDestroy;
    super(scope, id, keyProps);

    if (props.deleteKeyOnDestroy) {
      const lambda = new SingletonFunction(this, 'AutoKmsDeleteKeyHandler', {
        uuid: uuid(),
        runtime: Runtime.NODEJS_12_X,
        code: Code.asset(path.join(__dirname, '../lambda')),
        handler: 'index.handler',
        lambdaPurpose: 'KmsDeleteKey',
        timeout: cdk.Duration.minutes(15)
      })

      const provider = CustomResourceProvider.lambda(lambda)
      this.grant(lambda, 'kms:ScheduleKeyDeletion');

      new CustomResource(this, 'KmsDeleteKey', {
        provider,
        resourceType: 'Custom::KmsDeleteKey',
        properties: {
          KeyId: this.keyArn,
          PendingWindowInDays: 7
        }
      })
    };
  }
}
