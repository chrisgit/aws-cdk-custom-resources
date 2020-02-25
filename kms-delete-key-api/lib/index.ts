import * as cdk from '@aws-cdk/core';
import { Key, KeyProps } from '@aws-cdk/aws-kms';
import { AwsCustomResource } from '@aws-cdk/custom-resources';

export interface KmsDeleteKeyProps extends KeyProps {
  deleteKeyOnDestroy?: boolean;
}

export class KmsDeleteKey extends Key {

  constructor(scope: cdk.Construct, id: string, props: KmsDeleteKeyProps = {}) {
    let keyProps = Object.assign({}, props);
    delete keyProps.deleteKeyOnDestroy;
    super(scope, id, keyProps);

    if (props.deleteKeyOnDestroy) {
      var createParams = {
        KeyId: this.keyArn
      };

      var deleteParams = {
        KeyId: this.keyArn,
        PendingWindowInDays: 7
      };

      new AwsCustomResource(this, 'kmsDeleteKeyResource', {
        onCreate: { // Dummy call
          service: 'KMS',
          action: 'describeKey',
          parameters: createParams,
          physicalResourceId: this.keyArn,
        },
        onDelete: {
          service: 'KMS',
          action: 'scheduleKeyDeletion',
          parameters: deleteParams,
        },
      });
    }
  }
}
