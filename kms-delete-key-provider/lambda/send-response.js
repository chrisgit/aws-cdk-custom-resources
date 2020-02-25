const axios = require('axios');

export const sendResponse = async props => {
  const body = {
    Status: props.status,
    Reason: props.reason,
    PhysicalResourceId: props.physicalResourceId,
    StackId: props.stackId,
    RequestId: props.requestId,
    LogicalResourceId: props.logicalResourceId
  };

  const responseBody = JSON.stringify(body);
  console.log({ responseBody });

  await axios.put(props.responseUrl, responseBody, {
    data: responseBody,
    headers: { 'content-type': '', 'content-length': responseBody.length }
  });
};
