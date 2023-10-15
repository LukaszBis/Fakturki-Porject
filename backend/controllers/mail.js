const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ochraniacze1@gmail.com', 
    pass: 'kspnhixlzcalpyzn'
  }
});

async function send(email, token) {
  const mailOptions = {
    from: 'fakturki@gmail.com',
    to: email,
    subject: 'Fakturki - Resetowanie hasła',
    html: `<a href="http://localhost:5173/newPassword?token=${token}">To jest przykładowa treść wiadomości.</a>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Błąd wysyłania wiadomości:', error);
    } else {
      console.log('Wiadomość została wysłana: ' + info.response);
    }
  });
}

module.exports = { send };
