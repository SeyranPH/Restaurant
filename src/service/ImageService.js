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
  const fileStream = fs.createReadStream('../../tmp/uploads/image');
  const params = {
    Bucket: bucketName,
    Key: Math.random().toString(36).substring(2, 15),
    Body: fileStream,
  };
  const result = await s3.upload(params).promise();
  fs.unlink('../../tmp/uploads/image', (err) => {
    if (err) {
      console.log(err);
    }
  });
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
