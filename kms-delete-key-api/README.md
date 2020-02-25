# Delete KMS key with Custom Resource using AWS APIs

This project has a custom CDK KMS key resource that will optionally delete the KMS key when the stack is destroyed.

This is a contrived example because the KMS key can already be set to pending delete upon destroying the stack by setting the removalPolicy property to true!

## Background

Sometimes a single API call can fill the gap in the CloudFormation coverage. In this case you can use the AwsCustomResource construct. This construct creates a custom resource that can be customized to make specific API calls for the CREATE, UPDATE and DELETE events. Additionally, data returned by the API call can be extracted and used in other constructs/resources (creating a real CloudFormation dependency using Fn::GetAtt under the hood).

More details can be found here: https://docs.aws.amazon.com/cdk/api/latest/docs/custom-resources-readme.html#custom-resources-for-aws-apis

Essentially this demonstrates how easy it is to apply additional behavior to your resource with minimal effort.

## The Code

When running any of the cdk commands (such as `npx cdk ls`) the application that is run is contained inside of cdk.json file; in this case cdk.ts in the example folder is run. 

The cdk.ts will open Demo-Stack.ts which points to a custom resource contained in the lib folder.

The lib/index.ts file contains the custom resource; it is a construct based on the AWS KMS Key construct with a couple of extra instructions.

## How it works

Behind the scenes a lambda backing your resource is created, when the resource is destroyed the lambda is invoked and will carry out an action based on the commands available in the [AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/). In this example the [KMS scheduleKeyDeletion](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#scheduleKeyDeletion-property) method is called.