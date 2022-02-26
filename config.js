require('dotenv').config()

const {
    SG_API_KEY, 
    EMAIL_CONFIRMATION_TEMPLATE_ID, 
    SENDER_EMAIL, 
    SENDER_NAME,
    BASE_URL,
    JWT_SECRET
} = process.env

module.exports = {
    sgApiKey: SG_API_KEY,
    emailConfirmationTemplateId: EMAIL_CONFIRMATION_TEMPLATE_ID,
    senderEmail: SENDER_EMAIL,
    senderName: SENDER_NAME,
    baseUrl: BASE_URL,
    jwtSecret: JWT_SECRET
}