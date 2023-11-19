const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'TwojeFakturki@gmail.com', 
    pass: 'hnfpxunonbpivtsg'
  }
});

async function sendInvoice(email, pdfBuffer, name) {
  const mailOptions = {
    from: 'TwojeFakturki@gmail.com',
    to: email,
    subject: 'Fakturki - Faktura',
    html: `
    Faktura w załączniku
    `,
    attachments: [
      {
        filename: name+'.pdf',
        content: pdfBuffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Błąd wysyłania wiadomości:', error);
    } else {
      console.log('Wiadomość została wysłana: ' + info.response);
    }
  });
}

async function sendPasswordResetLink(email, token) {
  const mailOptions = {
    from: 'TwojeFakturki@gmail.com',
    to: email,
    subject: 'Fakturki - Resetowanie hasła',
    html: `
    <a href="http://localhost:5173" targer="_blank" style="display:inline-block;">
      <img src="https://drive.google.com/uc?export=view&id=12F9dzuCyRdE7Ov7G2iuwzHdtef63XJoC" style="width: 15em;"></img>
    </a>
    <h1 style="text-align: center; font-size:200%;">Zmień hasło</h1>
    <p><b>Witaj!</b></p><br/>
    <p><b>Próbujesz zmienić hasło konta <i style="font-weight:900;">${email}</i> na stornie Fakturki. Aby zmienić hasło kliknij w poniższy link.</b></p><br/>
    <a href="http://localhost:5173/newPassword?token=${token}" style="color:blue" targer="_blank">
        <b>Naciśnij aby zmienić hasło.</b>
    </a><br/><br/>
    <p><b>Pozdrawiamy,</b></p><br/>
    <p><b>Zespół Fakturki</b></p>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Błąd wysyłania wiadomości:', error);
    } else {
      console.log('Wiadomość została wysłana: ' + info.response);
    }
  });
}

async function sendActivationLink(email, token) {
  const mailOptions = {
    from: 'TwojeFakturki@gmail.com',
    to: email,
    subject: 'Fakturki - Aktywacja adresu email',
    html: `
    <a href="http://localhost:5173" targer="_blank" style="display:inline-block;">
      <img src="https://drive.google.com/uc?export=view&id=12F9dzuCyRdE7Ov7G2iuwzHdtef63XJoC" style="width: 15em;"></img>
    </a>
    <h1 style="text-align: center; font-size:200%;">Potwierdź swój email</h1>
    <p><b>Witaj!</b></p><br/>
    <p><b>Adres <i style="font-weight:900;">${email}</i> został wybrany jako Twój email do logowania na stornie Fakturki. Aby potwierdzić, że ten email należy do Ciebie kliknij w poniższy link.</b></p><br/>
    <a href="http://localhost:5173/confirmEmail?token=${token}" style="color:blue" targer="_blank">
        <b>Naciśnij aby aktywować adres email.</b>
    </a><br/><br/>
    <p><b>Pozdrawiamy,</b></p><br/>
    <p><b>Zespół Fakturki</b></p>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Błąd wysyłania wiadomości:', error);
    } else {
      console.log('Wiadomość została wysłana: ' + info.response);
    }
  });
}

module.exports = { sendInvoice,sendPasswordResetLink,sendActivationLink };
