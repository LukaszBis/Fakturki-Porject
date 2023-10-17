const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

//this is new \/
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//this is new \/
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,   //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
//this is new \/
app.use(cors(corsOptions)) // Use this after the variable declaration


const user = require("./controllers/user");
const validation = require("./controllers/validation");
const passwordReset = require("./controllers/passwordReset");
const active = require("./controllers/acitve");


async function checkTokens(){
  passwordReset.checkTokens();
  //active.checkTokens();
  setTimeout(function () {
    checkTokens();
  }, 10000);
  return;
}
checkTokens();


const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const htmlToPdf = require('html-pdf');

async function generatePdfFromHtml(htmlCode, res) {
  // Skonwertuj kod HTML na plik PDF za pomocą html-pdf
  htmlToPdf.create(htmlCode, {}).toStream((err, stream) => {
    if (err) {
      console.error('Błąd konwersji HTML na PDF:', err);
      res.status(500).send('Błąd generowania pliku PDF');
      return;
    }

    // Odczytaj plik PDF jako strumień i przekieruj go do odpowiedzi HTTP
    res.setHeader('Content-Disposition', 'attachment; filename=przykladowy.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    stream.pipe(res);
  });
}
app.get('/pdf', async (req, res) => {
  try {
    // Przykładowy kod HTML
const htmlCode = `
<!DOCTYPE html>
<html>
  <head>
    <title>Przykładowy PDF</title>
  </head>
  <style>
  body{
    background-color:red;
  }
  </style>
  <body>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
    <h1>Przykładowy PDF</h1>
    <p>To jest przykład pliku PDF utworzonego z kodu HTML.</p>
  </body>
</html>
`;

    generatePdfFromHtml(htmlCode, res);
  } catch (error) {
    console.error('Błąd podczas obsługi ścieżki :', error);
    res.status(400).send('Wystąpił błąd podczas pobierania danych.');
  }
});



app.get('/', async (req, res) => {
  try {
    let tableHTML = req.query.status+'<br><table>';
    tableHTML += '<tr><th>Email</th><th>Imię</th><th>Nazwisko</th></tr>';

    const users = await user.displayAll();
    users.forEach((user) => {
      tableHTML += `<tr><td>${user.email}</td><td>${user.firstName}</td><td>${user.lastName}</td></tr>`;
    });

    tableHTML += '</table>';

    res.send(tableHTML);
  } catch (error) {
    console.error('Błąd podczas obsługi ścieżk:', error);
    res.status(400).send('Wystąpił błąd podczas pobierania danych.');
  }
});

app.post('/resetPassword', async (req, res) => {
  const email = req.body.email;

  const get_user = await user.checkEmail(email);
  if (get_user) {
    const check = passwordReset.add(email);
    if (check){
      res.send({success:"Email wysłany"});
      return;
    }
    res.send({fail:"Email nie został wysłany"});
    return;
  }
  res.send({fail:"Email nie znaleziony"});
});

app.post('/setNewPassword', async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  let err = false;
  let fail = {
    token:[],
    password:[],
    confirmPassword:[],
  };
  
  if(!await passwordReset.checkToken(token)){
    fail.token.push("Nie można zmienić hasła, spróbuj ponownie.");
    res.json({ fail });
    return;
  }

  validation.check(fail.password,password)?err=true:null;
  validation.password(fail.password,password)?err=true:null;
  validation.min(fail.password,password,8)?err=true:null;
  validation.max(fail.password,password,20)?err=true:null;
 
  validation.check(fail.confirmPassword,confirmPassword)?err=true:null;
  validation.compare(fail.confirmPassword,confirmPassword,password)?err=true:null;
  console.log(fail);
  if (err){
    res.json({ fail });
    return;
  }

  const get_email = await passwordReset.getEmailByToken(token);
  const get_user = await user.checkEmail(get_email);
  if (get_user) {
    if(await user.passwordCompare(get_user.passwordHash, password)){
      fail.password.push("Hasło nie może być takie samo jak stare hasło.");
      res.json({ fail });
      return;
    }
    passwordReset.removeToken(get_email);
    await user.changePassword(get_user, password);
    res.send({success:"Hasło pomyślnie zmienione"});
    return;
  }
  res.send({fail:"Nie udało się zmienić hasła"});
});

app.post('/active', async (req, res) => {
  const token = req.body.token;
  
  if(!await active.checkToken(token)){
    res.json({ fail:"Link nie jest aktualny." });
    return;
  }

  const email = await active.getEmailByToken(token);
  if (email && await user.active(email)) {
    active.removeToken(email);
    res.send({success:"Konto aktywowane pomyślnie"});
    return;
  }
  res.send({fail:"Konto nie istnieje"});
});

app.post('/auth', async (req, res) => {
  const id = req.body.user;
  if(id && await user.auth(id)){
    res.send({success:"gratulacje użytkowniku"})
    return;
  }
  res.send({fail:"Error"});
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const get_user = await user.checkEmail(email);
  if (get_user) {
    const passwordHash = get_user.passwordHash;
    if (await user.passwordCompare(passwordHash, password)){
      res.send({success:get_user._id});
      return;
    }
    res.send({fail:"Niepoprawne hasło."});
    return;
  }
  res.send({fail:"Konto nie istnieje."});
});

app.post('/register', async (req, res) => {
  //no query instead use body with parser
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phoneNumber = req.body.phoneNumber;
  const postalCode = req.body.postalCode;
  const city = req.body.city;
  const street = req.body.street;
  const buildingNumber = req.body.buildingNumber;
  const apartmentNumber = req.body.apartmentNumber;
  const NIP = req.body.NIP;

  let err = false;
  let errors = {
    email:[],
    password:[],
    confirmPassword:[],
    firstName:[],
    lastName:[],
    phoneNumber:[],
    postalCode:[],
    city:[],
    street:[],
    buildingNumber:[],
    apartmentNumber:[],
    NIP:[]
  };
  validation.check(errors.email,email)?err=true:null;
  validation.email(errors.email,email)?err=true:null;
  await user.emailUnique(errors.email,email)?err=true:null;

  validation.check(errors.password,password)?err=true:null;
  validation.password(errors.password,password)?err=true:null;
  validation.min(errors.password,password,8)?err=true:null;
  validation.max(errors.password,password,20)?err=true:null;

  validation.check(errors.confirmPassword,confirmPassword)?err=true:null;
  validation.compare(errors.confirmPassword,confirmPassword,password)?err=true:null;

  validation.check(errors.firstName,firstName)?err=true:null;
  validation.text(errors.firstName,firstName)?err=true:null;

  validation.check(errors.lastName,lastName)?err=true:null;
  validation.text(errors.lastName,lastName)?err=true:null;

  validation.check(errors.phoneNumber,phoneNumber)?err=true:null;
  validation.number(errors.phoneNumber,phoneNumber)?err=true:null;
  validation.equal(errors.phoneNumber,phoneNumber,9)?err=true:null;

  validation.check(errors.postalCode,postalCode)?err=true:null;

  validation.check(errors.city,city)?err=true:null;
  validation.text(errors.city,city)?err=true:null;

  validation.check(errors.street,street)?err=true:null;
  validation.text(errors.street,street)?err=true:null;

  validation.check(errors.buildingNumber,buildingNumber)?err=true:null;

  validation.check(errors.NIP,NIP)?err=true:null;
  validation.number(errors.NIP,NIP)?err=true:null;
  validation.equal(errors.NIP,NIP,10)?err=true:null;
  await user.NIPUnique(errors.NIP,NIP)?err=true:null;
  if (err){
    res.json({ errors });
    return;
  }

  const get_user = await user.add(firstName, email, password, postalCode, street, lastName, Number(phoneNumber), city, buildingNumber, apartmentNumber, Number(NIP));
  //response variable
  //res.status(200).send({user-firstname:firstName});
  //response json
  //res.status(200).json({user_data:user});
  
  if(get_user){
    const check = active.add(email);
    if (check){
      res.send({success:get_user._id});
      return;
    }
    res.send({fail:"Email nie został wysłany"});
    return;
  }
  res.send({fail:"Użytkownik nie został utworzony"});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});