const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

//this is new \/
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adres klienta
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Włącz przekazywanie ciasteczek
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Obsługa preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).send();
  } else {
    next();
  }
});

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
const invoice = require("./controllers/invoice");
const validation = require("./controllers/validation");
const passwordReset = require("./controllers/passwordReset");
const active = require("./controllers/acitve");
const pdf = require("./controllers/pdf");
const Bir = require('bir1');


async function checkTokens(){
  passwordReset.checkTokens();
  active.checkTokens();
  setTimeout(function () {
    checkTokens();
  }, 10000);
  return;
}
checkTokens();





app.get('/downloadPdf', async (req, res) => {
  pdf.downloadPdf(res, req.query.id)
});
app.post('/sendPdf', async (req, res) => {
  pdf.sendPdf(req.body.email, req.body.id)?
  res.send({success:"Pomyślnie wysłano fakturę na adres "+req.query.email}):
  res.send({success:"Nie udało się wysłać faktury na adres "+req.query.email})
});
app.post('/invoiceDelete', async (req, res) => {
  invoice.remove(req.query.id)?
  res.send({success:"Pomyślnie usunięto fakturę"}):
  res.send({success:"Nie udało się usunąć faktury"})
});



app.get('/', async (req, res) => {
  // const nip = req.query.nip

  // const wl = await validation.nip([], nip)
  // console.log(wl)
  // const bir = new Bir(key = "abcde12345abcde12345")
  // await bir.login()
  // await bir.search({ nip: nip }).then((response) => {
  //   console.log(response)
  // })
  // .catch((error) => {
  //   console.error(error)
  // })
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

app.post('/reactivate', async (req, res) => {
  const email = req.body.email;
  const get_user = await user.checkEmail(email);

  if(get_user && get_user.emailActivated_at == null){
    const check = active.add(email);
    if (check){
      res.send({success:"Email został wysłany"});
      return;
    }
    res.send({fail:"Email nie został wysłany"});
    return;
  }
  res.send({fail:"Użytkownik nie został utworzony"});
});

app.post('/auth', async (req, res) => {
  const id = req.body.user;
  console.log("user")
  const get_user = await user.auth(id);
  if(id && get_user){
    let response = {}
    if(req.body.details){
      response.details = get_user
    }
    if(req.body.active && get_user.emailActivated_at == null){
      response.active = true
    }else if(req.body.invoices){
      response.invoices = await invoice.findAll(get_user._id.toString());
    }
    response.success = "gratulacje użytkowniku"
    res.send(response);
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
  const accountNumber = req.body.accountNumber;

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
    NIP:[],
    accountNumber:[]
  };
  validation.check(errors.email,email);
  validation.email(errors.email,email);
  await user.emailUnique(errors.email,email);
  errors.email.length > 0?err=true:null;

  validation.check(errors.password,password);
  validation.password(errors.password,password);
  validation.min(errors.password,password,8);
  validation.max(errors.password,password,20);
  errors.password.length > 0?err=true:null;

  validation.check(errors.confirmPassword,confirmPassword);
  validation.compare(errors.confirmPassword,confirmPassword,password);
  errors.confirmPassword.length > 0?err=true:null;

  validation.check(errors.firstName,firstName);
  validation.text(errors.firstName,firstName);
  errors.firstName.length > 0?err=true:null;

  validation.check(errors.lastName,lastName);
  validation.text(errors.lastName,lastName);
  errors.lastName.length > 0?err=true:null;

  validation.check(errors.phoneNumber,phoneNumber);
  validation.number(errors.phoneNumber,phoneNumber);
  validation.equal(errors.phoneNumber,phoneNumber,9);
  errors.phoneNumber.length > 0?err=true:null;

  validation.check(errors.postalCode,postalCode);
  errors.postalCode.length > 0?err=true:null;

  validation.check(errors.city,city);
  validation.text(errors.city,city);
  errors.city.length > 0?err=true:null;

  validation.check(errors.street,street);
  validation.text(errors.street,street);
  errors.street.length > 0?err=true:null;

  validation.check(errors.buildingNumber,buildingNumber);
  errors.buildingNumber.length > 0?err=true:null;

  validation.check(errors.NIP,NIP);
  validation.number(errors.NIP,NIP);
  validation.equal(errors.NIP,NIP,10);
  await validation.nip(errors.NIP,NIP);
  errors.NIP.length == 0?await user.NIPUnique(errors.NIP,NIP):null
  errors.NIP.length > 0?err=true:null;

  validation.check(errors.accountNumber,accountNumber);
  validation.number(errors.accountNumber,accountNumber);
  validation.equal(errors.accountNumber,accountNumber,26);
  errors.accountNumber.length == 0?await user.accountNumberUnique(errors.accountNumber,accountNumber):null;
  errors.accountNumber.length > 0?err=true:null;
  if (err){
    res.json({ errors });
    return;
  }

  const get_user = await user.add(firstName, email, password, postalCode, street, lastName, Number(phoneNumber), city, buildingNumber, apartmentNumber, Number(NIP), accountNumber);
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

app.post('/invoice', async(req,res) => {
  const date = new Date()
  const month = date.getMonth();
  const fixedMonth = String(month + 1).padStart(2, '0');
  const year = date.getFullYear();
  const counter = await invoice.count(req.body.userId,month,year);
  const checkUser = await user.auth(req.body.userId);
  console.log("Policzone: ",counter)
  if(counter <= 0){
    await user.resetCounter(checkUser)
  }
  req.body.name = `FS ${checkUser.counter+1}/${fixedMonth}/${year}`
  user.increseCounter(checkUser)

  // const bir = new Bir()
  // await bir.login()
  // console.log(await bir.search({ nip: nip }))

  if(invoice.add(req.body)){
    res.send({success:'Dodano fakture'});
  }else{
    res.send({fail:'Nie dodano faktury'});
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});