const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const {
  bucketName,
  bucketRegion,
  awsAccessKey,
  awsSecretKey,
} = require('../../config');

const s3 = new S3({
  region: bucketRegion,
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
});

async function uploadImageToS3(file) {
  const fileStream = fs.createReadStream(file.path);
  const params = {
    Bucket: bucketName,
    Key: file.originalname,
    Body: fileStream,
  };
  const result = await s3.upload(params).promise();
  return result.Location;
}

async function deleteImageFromS3(filename) {
  const params = {
    Bucket: bucketName,
    Key: filename,
  };
  const result = await s3.deleteObject(params).promise();
  return result;
}

module.exports = {
  uploadImageToS3,
  deleteImageFromS3,
};
