import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { KmsDeleteKey } from '../lib/index';

test('WhenNotDeleteKeyThenCustomResourceNotIncludedInStack', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  // WHEN
  new KmsDeleteKey(stack, 'MyTestConstruct');
  // THEN
  expectCDK(stack).to(haveResource("AWS::KMS::Key"));
  expectCDK(stack).notTo(haveResource("Custom::AWS"));
});

test('WhenDeleteKeyThenCustomResourceIncludedInStack', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");

  // WHEN
  new KmsDeleteKey(stack, 'MyTestConstruct', { deleteKeyOnDestroy: true });
  // THEN
  expectCDK(stack).to(haveResource("AWS::KMS::Key"));
  expectCDK(stack).to(haveResource("Custom::AWS"));
});

test('WhenKmsPropertiesSetThenResourceCreatedCorrectly', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  const params = {
    alias: 'TestKey',
    description: 'Test Key for Custom Resource',
    enabled: true
  };

  // WHEN
  new KmsDeleteKey(stack, 'MyTestConstruct', params);
  // THEN
  expectCDK(stack).to(haveResource("AWS::KMS::Key", {
    "Description": "Test Key for Custom Resource",
    "Enabled": true
  }));
});
