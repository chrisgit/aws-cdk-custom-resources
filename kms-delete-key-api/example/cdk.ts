#!/usr/bin/env node
import { App, Tag } from '@aws-cdk/core'
import { DemoStack } from './demo-stack'

const cdk = new App()
const example = new DemoStack(cdk, 'kms-delete-example', {});
example.node.applyAspect(new Tag('kms-delete', 'true'));
