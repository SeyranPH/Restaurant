const config = require('../../config');
const sgMail = require("@sendgrid/mail");

const {sgApiKey, emailConfirmationTemplateId, senderEmail, senderName, baseUrl}  = config;

sgMail.setApiKey(sgApiKey);

async function sendEmailConfirmation({ to, token }) {
  const msg = {
    to: to,
    from: {
      name: senderName,
      email: senderEmail,
    },
    template_id: emailConfirmationTemplateId,
    dynamicTemplateData: {
      url: `${baseUrl}/email-confirmation/${token}`,
    },
  };
  const result = await sgMail.send(msg);
  return result;
}

module.exports = { sendEmailConfirmation } 
