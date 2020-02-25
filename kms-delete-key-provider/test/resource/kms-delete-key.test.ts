import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { KmsDeleteKey } from '../../lib/index';

test('When KMS key created without parameters Then backing lambda to delete key is not created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");

  new KmsDeleteKey(stack, 'MyTestConstruct');

  expectCDK(stack).to(haveResource("AWS::KMS::Key"));
  expectCDK(stack).notTo(haveResource("Custom::KmsDeleteKey"));
});

test('When KMS key created with deleteKeyOnDestroy Then backing lambda to delete key is created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");

  new KmsDeleteKey(stack, 'MyTestConstruct', { deleteKeyOnDestroy: true });

  expectCDK(stack).to(haveResource("AWS::KMS::Key"));
  expectCDK(stack).to(haveResource("Custom::KmsDeleteKey"));
});

test('When KMS key created with properties Then properties remain unaffected by Custom Resource', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  const params = {
    alias: 'TestKey',
    description: 'Test Key for Custom Resource',
    enabled: true
  };

  new KmsDeleteKey(stack, 'MyTestConstruct', params);

  expectCDK(stack).to(haveResource("AWS::KMS::Key", {
    "Description": "Test Key for Custom Resource",
    "Enabled": true
  }));
});
