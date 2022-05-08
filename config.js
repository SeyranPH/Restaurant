require('dotenv').config();

const {
  PORT,
  DATABASE_URL,
  SG_API_KEY,
  EMAIL_CONFIRMATION_TEMPLATE_ID,
  SENDER_EMAIL,
  SENDER_NAME,
  BASE_URL,
  JWT_SECRET,
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

module.exports = {
  port: PORT,
  dbUrl: DATABASE_URL,
  sgApiKey: SG_API_KEY,
  emailConfirmationTemplateId: EMAIL_CONFIRMATION_TEMPLATE_ID,
  senderEmail: SENDER_EMAIL,
  senderName: SENDER_NAME,
  baseUrl: BASE_URL,
  jwtSecret: JWT_SECRET,
  bucketName: AWS_BUCKET_NAME,
  bucketRegion: AWS_BUCKET_REGION,
  awsAccessKey: AWS_ACCESS_KEY_ID,
  awsSecretKey: AWS_SECRET_ACCESS_KEY
};

