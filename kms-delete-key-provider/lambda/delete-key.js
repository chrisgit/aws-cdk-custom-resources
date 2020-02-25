const AWS = require('aws-sdk');
const kms = new AWS.KMS();

exports.deleteSecretKey = async function (deleteProperties) {
    await kms.scheduleKeyDeletion(deleteProperties).promise();
};
