import { App, Stack, StackProps } from '@aws-cdk/core'
import { KmsDeleteKey } from '../lib/index'

export class DemoStack extends Stack {
    constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props)

        new KmsDeleteKey(this, 'test-delete', {
            alias: 'Test-Delete-Alias',
            description: 'This is a test KMS key using custom resource',
            enabled: true,
            deleteKeyOnDestroy: true
        });

    }
}