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
  if (pdf.sendPdf(req.body.email, req.body.id)) {
    res.status(200).json({ success: "Pomyślnie wysłano fakturę na adres " + req.query.email });
  } else {
    res.status(400).json({ fail: "Nie udało się wysłać faktury na adres " + req.query.email });
  }
});

app.post('/invoiceDelete', async (req, res) => {
  if (invoice.remove(req.query.id)) {
    res.status(200).json({ success: "Pomyślnie usunięto fakturę" });
  } else {
    res.status(400).json({ fail: "Nie udało się usunąć faktury" });
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
    if (check) {
      return res.status(200).send({ success: "Email wysłany" });
    }
    return res.status(500).send({ fail: "Email nie został wysłany" });
  }
  return res.status(404).send({ fail: "Email nie znaleziony" });
});

app.post('/setNewPassword', async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  let err = false;
  let fail = {
    token: [],
    password: [],
    confirmPassword: [],
  };

  if (!await passwordReset.checkToken(token)) {
    fail.token.push("Nie można zmienić hasła, spróbuj ponownie.");
    return res.status(400).json({ fail });
  }

  validation.check(fail.password, password) ? err = true : null;
  validation.password(fail.password, password) ? err = true : null;
  validation.min(fail.password, password, 8) ? err = true : null;
  validation.max(fail.password, password, 20) ? err = true : null;

  validation.check(fail.confirmPassword, confirmPassword) ? err = true : null;
  validation.compare(fail.confirmPassword, confirmPassword, password) ? err = true : null;

  if (err) {
    return res.status(400).json({ fail }); 
  }

  const get_email = await passwordReset.getEmailByToken(token);
  const get_user = await user.checkEmail(get_email);
  if (get_user) {
    if (await user.passwordCompare(get_user.passwordHash, password)) {
      fail.password.push("Hasło nie może być takie samo jak stare hasło.");
      return res.status(400).json({ fail }); 
    }

    passwordReset.removeToken(get_email);
    await user.changePassword(get_user, password);
    return res.status(200).json({ success: "Hasło pomyślnie zmienione" });
  }

  return res.status(400).json({ fail: "Nie udało się zmienić hasła" });
});

app.post('/active', async (req, res) => {
  const token = req.body.token;

  if (!await active.checkToken(token)) {
    return res.status(400).json({ fail: "Link nie jest aktualny." });
  }

  const email = await active.getEmailByToken(token);
  if (email && await user.active(email)) {
    active.removeToken(email);
    return res.status(200).json({ success: "Konto aktywowane pomyślnie" }); 
  }

  return res.status(400).json({ fail: "Konto nie istnieje" });
});

app.post('/reactivate', async (req, res) => {
  const email = req.body.email;
  const get_user = await user.checkEmail(email);

  if (get_user && get_user.emailActivated_at == null) {
    const check = active.add(email);
    if (check) {
      return res.status(200).json({ success: "Email został wysłany" });
    }
    return res.status(400).json({ fail: "Email nie został wysłany" });
  }

  return res.status(400).json({ fail: "Użytkownik nie został utworzony" });
});

app.post('/auth', async (req, res) => {
  const id = req.body.user;
  if (!id){
    return res.status(400).send({fail:"Niepoprawne dane"});
  }
  const get_user = await user.auth(id);
  if(!get_user){
    return res.status(204).send({fail:"Użytkownik nie istnieje"});
  }

  let data = {}
  if(req.body.details){
    data.details = get_user
  }
  if(req.body.active && get_user.emailActivated_at == null){
    data.active = true
  }else{
    if(req.body.invoices){
      data.invoices = await invoice.findAll(get_user._id.toString());
    }
    if(req.body.nip){
      data.nipArray = [1234567891,4567892314]
    }
  }
  return res.status(200).send(data);
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const get_user = await user.checkEmail(email);
  if (!get_user) {
    return res.status(204).send({fail:"Konto nie istnieje"});
  }
  const passwordHash = get_user.passwordHash;
  if (await user.passwordCompare(passwordHash, password)){
    return res.status(200).send({success:get_user._id});
  }
  res.status(204).send({fail:"Niepoprawne hasło."});
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

  {
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
      res.status(204).json({ errors });
      return;
    }
  }
  let get_user
  try{
    get_user = await user.add(firstName, email, password, postalCode, street, lastName, Number(phoneNumber), city, buildingNumber, apartmentNumber, Number(NIP), accountNumber);
  }catch(error){
    console.error(error)
    return res.status(500).send({fail:"Użytkownik nie został utworzony"});
  }

  const check = active.add(email);
  if (check){
    return res.status(200).send({success:get_user._id});
  }
  return res.status(500).send({fail:"Email nie został wysłany"});
});

app.post('/invoice', async(req,res) => {
  {
    let err = false;
    let errors = {
      clientNIP:[],
      dateIssuance:[],
      dateSell:[],
      place:[],
      services:[],
      payType:[],
      payDate:[],
      account:[],
      seller:[]
    };
    validation.check(errors.clientNIP,req.body.client);
    validation.number(errors.clientNIP,req.body.client);
    validation.equal(errors.clientNIP,req.body.client,10);
    await validation.nip(errors.clientNIP,req.body.client);
    errors.clientNIP.length == 0?await user.NIPUnique(errors.clientNIP,req.body.client):null
    errors.clientNIP.length > 0?err=true:null;
    
    // validation.check(errors.street,street);
    // validation.text(errors.city,city);
    // validation.number(errors.phoneNumber,phoneNumber);
    // validation.equal(errors.phoneNumber,phoneNumber,9);
    // errors.street.length > 0?err=true:null;


    if (err){
      res.status(204).json({ errors });
      return;
    }
  }

  const bir = new Bir()
  await bir.login()
  try{
    const clientData = await bir.search({ nip: req.body.client })
    req.body.clientName = clientData.nazwa
    req.body.clientNIP = clientData.nip
    req.body.clientStreet = clientData.ulica+' '+clientData.nrNieruchomosci
    clientData.nrLokalu?req.body.clientStreet+=' '+clientData.nrLokalu:null
    req.body.clientCity = clientData.kodPocztowy+' '+clientData.miejscowosc
  }catch(error){
    console.error(error)
    return res.status(500).json({ fail: 'Dane klienta są niepoprawne' });
  }

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

  try{
    invoice.add(req.body)
  }catch(error){
    console.error(error)
    return res.status(500).json({ fail: 'Nie dodano faktury' });
  }
  
  return res.status(200).json({ success: 'Dodano fakturę' });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});