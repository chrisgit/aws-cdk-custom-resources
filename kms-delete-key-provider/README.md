# Delete KMS key with Custom Resource using Provider Framework

This project has a custom CDK KMS key resource that will optionally delete the KMS when the stack is destroyed.

This is a contrived example because the KMS key can already be set to pending delete upon destroying the stack by setting the removalPolicy property to true!

## Background
The inspiration for this solution comes from auto delete S3 bucket: https://github.com/mobileposse/auto-delete-bucket 

There were two reasons for looking at the auto bucket delete solution
- Currently no pre or post event hooks in CDK (which is a popular request https://github.com/aws/aws-cdk-rfcs/issues/75)
- Clean up the environment after destroying a stack

The custom resource creates a backing lambda that is automatically invoked by Cloudformation when the resource is Created, Updated or Deleted. The lambda must return a success or fail response.

## The Code

The example folder contains 
- cdk.ts which is the entry point when running cdk commands such as `npx cdk ls`
- demo-stack.ts which contains an example stack using the custom resource

The lambda folder contains
- delete-key.js a thin wrapper to delete the KMS key using the AWS SDK
- index.js the main lamdba entry point
- send-response.js to post back a status reply to Cloudformation

The lib folder contains
- index.ts which is the custom resource definition, this resource also creates the backing lambda

This solution (and the delete S3 bucket solution) uses
- [Webpack](https://webpack.js.org/) to package the backing lambda, artefacts are copied to the dist folder
- [Babel](https://babeljs.io/) translate the JavaScript from ES6

When `npm run build` is run the lambda (and resource) are copied to the dist folder.

However to simplify the deployment of the lambda we could have had placed all of the code into a single main.js file, although CDK will happily upload all of the source files in the lambda folder. Something to note is that AWS lambda does not support new JavaScript ES6 syntax, i.e. Import {  }, if the new syntax is used you will need to translate it.

Instead of using webpack could have added a package.json in the lambda folder, then as part of the post-install script of the project.json in the root folder installed dependant packages.
- "postinstall": "(cd lambda && npm install)" 

The idea behind the Provider Framework is that your resource will create a Singleton lambda which backs an AWS resource, the lambda responds to messages send from Cloudformations.

The message requests typically look like this
```
{
   "RequestType" : "Create",
   "RequestId" : "unique id for this create request",
   "ResponseURL" : "pre-signed-url-for-create-response",
   "ResourceType" : "Custom::MyCustomResourceType",
   "LogicalResourceId" : "name of resource in template",
   "StackId" : "arn:aws:cloudformation:us-east-2:namespace:stack/stack-name/guid",
   "ResourceProperties" : {
      "key1" : "string",
      "key2" : [ "list" ],
      "key3" : { "key4" : "map" }
   }
}      
```
More details about the requests can be found here: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requesttypes.html

The message responses take the request and add a status and a reason, sending the response to the requests ResponseURL, more details are here: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-responses.html

When debugging this type of resource it's not uncommon for the lambda to fail to return the appropriate message which will stop the stack being created, updated or destroyed. In cases like these you will have to
- [manually send the message to the AWS API](https://aws.amazon.com/premiumsupport/knowledge-center/cloudformation-lambda-resource-delete/)
- let the stack create/update/delete timeout, in the case of delete you can re-try the deletion but preserve (or ignore) certain resources

The unit tests for this project use [Jest](https://jestjs.io), there are tests for the lambda and CDK resource.

## What is the AWS CDK Provider Framework

AWS CloudFormation custom resources are extension points to the provisioning engine. When CloudFormation needs to create, update or delete a custom resource, it sends a lifecycle event notification to a custom resource provider. The provider handles the event (e.g. creates a resource) and sends back a response to CloudFormation.

For more information see here: https://docs.aws.amazon.com/cdk/api/latest/docs/custom-resources-readme.html#provider-framework

## Other examples

Aside from the S3 Auto Delete bucket there are some other inspirational examples such as S3 CopyOperation, code extract below

```JavaScript
interface CopyOperationProps {
  sourceBucket: IBucket;
  targetBucket: IBucket;
}

class CopyOperation extends Construct {
  constructor(parent: Construct, name: string, props: CopyOperationProps) {
    super(parent, name);

    const lambdaProvider = new lambda.SingletonFunction(this, 'Provider', {
      uuid: 'f7d4f730-4ee1-11e8-9c2d-fa7ae01bbebc',
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.fromAsset('../copy-handler'),
      handler: 'index.handler',
      timeout: Duration.seconds(60),
    });

    new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.lambda(lambdaProvider),
      properties: {
        sourceBucketArn: props.sourceBucket.bucketArn,
        targetBucketArn: props.targetBucket.bucketArn,
      }
    });
  }
}
```