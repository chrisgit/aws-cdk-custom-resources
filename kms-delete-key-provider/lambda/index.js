// ES6 import not supported
// If pushing to Lambda via Webpack or Babel then ES6 import is fine
// If pushing directly to Lambda then older style require needed (see below)
const deleteSecretKey = require('./delete-key').deleteSecretKey;
const sendResponse = require('./send-response').sendResponse;

exports.handler = async function (event, context) {
    console.log(JSON.stringify(event, null, 2));
    console.log(JSON.stringify(context, null, 2));

    let eventProperties = event.ResourceProperties;
    let deleteProperties = {
        KeyId: eventProperties.keyArn,
        PendingWindowInDays: eventProperties.PendingWindowInDays,
    };

    let status = 'SUCCESS';
    let reason = '';
    if (event.RequestType == 'Delete') {
        try {
            await deleteSecretKey(deleteProperties);
        } catch (err) {
            reason = `Unable to delete secret key ${deleteProperties.KeyId} - ${err}`;
            status = 'FAILED';
        }
    }

    await sendResponse({
        status: status,
        requestId: event.RequestId,
        stackId: event.StackId,
        reason: reason,
        logicalResourceId: event.LogicalResourceId,
        physicalResourceId: `${deleteProperties.KeyId}-${event.LogicalResourceId}`,
        responseUrl: event.ResponseURL
    });
};
