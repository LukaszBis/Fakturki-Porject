const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Możesz użyć też 'Gmail'
  auth: {
    user: 'ochraniacze1@gmail.com', // Wprowadź swoją nazwę użytkownika
    pass: 'kspnhixlzcalpyzn' // Wprowadź swoje hasło
  }
});

function send(email){
    const mailOptions = {
      from: 'fakturki@gmail.com', // Adres e-mail nadawcy
      to: email, // Adres e-mail odbiorcy
      subject: 'Przykładowy temat', // Temat wiadomości
      text: 'To jest przykładowa treść wiadomości.' // Treść wiadomości
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log('Błąd wysyłania wiadomości:', error);
      } else {
        console.log('Wiadomość została wysłana: ' + info.response);
      }
    });
}

module.exports = { send };
