# AWS CDK Custom Resources

Small demo applications showing two different methods for creating custom resources using the Cloud Development Kit (CDK).

Really demonstrating
- Custom Resources
- Using runtime context for control (of environment)

### Prerequisites

- LTS version of Node, currently the minimum version supported is [Node ≥ 10.3.0](https://nodejs.org/download/release/latest-v10.x/))
- [AWS Cloud Development Kit](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)
- [Source Code Editor](https://code.visualstudio.com/download)
- [AWS Account](https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc)

### Running the samples

- Download or clone the repository
- Change current directory to one of the sub projects
- Install the dependencies `npm ci`

- Use CDK to 
- list stacks `npx cdk ls`
- deploy stacks `npx cdk deploy`
- destroy stacks `npx cdk destroy`

To provide extra debugging information when executing the CDK commands you can use -v parameter or cdk doctor
- npx cdk deploy -v
- npx cdk doctor

## Running the tests

The unit tests for CDK examine the results of a CDK synth to ensure resources are generated and have the appropriate properties.

- Run unit tests `npm run test`

## License

This project is licensed under the MIT License
