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
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
//this is new \/
app.use(cors(corsOptions)) // Use this after the variable declaration




const user = require("./controllers/user");
const validation = require("./controllers/validation");
const mail = require("./controllers/mail");




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
    console.error('Błąd podczas obsługi ścieżki /login:', error);
    res.status(400).send('Wystąpił błąd podczas pobierania danych.');
  }
});

app.post('/resetPassword', async (req, res) => {
  const email = req.body.email;

  const get_user = await user.emailUnique(email);
  if (get_user) {
    mail.send(email);
    res.send({success:"Email znaleziony"});
    return;
  }
  res.send({fail:"Email nie znaleziony"});
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email.trim() == ''){
    return;
  }

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
  res.send({fail:"Niepoprawny adres email."});
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
  res.send({success:get_user._id});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});