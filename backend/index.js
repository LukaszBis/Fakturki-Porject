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

const db = require("./controllers/database");
const user = require("./controllers/user");
const invoice = require("./controllers/invoice");
const validation = require("./controllers/validation");
const token = require("./controllers/token");
const pdf = require("./controllers/pdf");
const Bir = require('bir1');


async function checkTokens(){
  token.removeOld('email', 10);
  token.removeOld('password', 10);
  setTimeout(function () {
    checkTokens();
  }, 10000);
  return;
}
checkTokens();





app.get('/downloadPdf', async (req, res) => {
  const id = req.query.id;
  const invoice = await invoice.getById(id).name
  pdf.downloadPdf(res, id, invoice)
});
app.post('/sendPdf', async (req, res) => {
  const email = req.body.email;
  const id = req.body.id;
  const invoice = await invoice.getById(id).name
  if (await pdf.sendPdf(email, id, invoice)) {
    res.status(200).json({ success: "Pomyślnie wysłano fakturę na adres " + req.query.email });
  } else {
    res.status(200).json({ fail: "Nie udało się wysłać faktury na adres " + req.query.email });
  }
});
app.post('/invoiceDelete', async (req, res) => {
  if (invoice.remove(req.query.id)) {
    res.status(200).json({ success: "Pomyślnie usunięto fakturę" });
  } else {
    res.status(200).json({ fail: "Nie udało się usunąć faktury" });
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
    res.status(200).send('Wystąpił błąd podczas pobierania danych.');
  }
});

app.post('/resetPassword', async (req, res) => {
  const email = req.body.email;

  const get_user = await user.checkEmail(email);
  if (get_user) {
    if (token.addToken('password', email)) {
      return res.status(200).send({ success: "Email wysłany" });
    }
    return res.status(200).send({ fail: "Email nie został wysłany" });
  }
  return res.status(200).send({ fail: "Email nie znaleziony" });
});

app.post('/setNewPassword', async (req, res) => {
  const ctoken = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  let err = false;
  let fail = {
    token: [],
    password: [],
  };

  const get_token = await token.checkToken('password', ctoken)
  if (!get_token) {
    return res.status(200).json({ fail: "Nie można zmienić hasła, spróbuj ponownie." });
  }

  validation.check(fail.password, password) ? err = true : null;
  validation.password(fail.password, password) ? err = true : null;
  validation.min(fail.password, password, 8) ? err = true : null;
  validation.max(fail.password, password, 20) ? err = true : null;

  validation.check(fail.password, confirmPassword) ? err = true : null;
  validation.compare(fail.password, confirmPassword, password) ? err = true : null;

  if (err) {
    return res.status(200).json({ fail }); 
  }
  try{
    const get_email = await token.getEmailByToken('password', ctoken);
    const get_user = await user.checkEmail(get_email);
    if (get_user) {
      if (await user.passwordCompare(get_user.passwordHash, password)) {
        fail.password.push("Hasło nie może być takie samo jak stare hasło.");
        return res.status(200).json({ fail }); 
      }

      token.removeToken('password', get_email);
      await user.changePassword(get_user, password);
      return res.status(200).json({ success: "Hasło pomyślnie zmienione" });
    }

    return res.status(200).json({ fail: "Nie udało się zmienić hasła" });
  }catch(error){
    return res.status(500);
  }
});

app.post('/active', async (req, res) => {
  const ctoken = req.body.token;
  const get_token = await token.checkToken('email', ctoken)
  if (!get_token) {
    return res.status(200).json({ fail: "Link nie jest aktualny." });
  }

  const email = await token.getEmailByToken('email', ctoken);
  if (email && await user.active(email)) {
    token.removeToken('email', email);
    return res.status(200).json({ success: "Konto aktywowane pomyślnie" }); 
  }

  return res.status(200).json({ fail: "Konto nie istnieje" });
});

app.post('/reactivate', async (req, res) => {
  const email = req.body.email;
  const get_user = await user.checkEmail(email);
  if (get_user && get_user.emailActivated_at == null) {
    const check = token.addToken('email', email);
    if (check) {
      return res.status(200).json({ success: "Email został wysłany" });
    }
    return res.status(200).json({ fail: "Email nie został wysłany" });
  }

  return res.status(200).json({ fail: "Użytkownik nie został utworzony" });
});

app.post('/auth', async (req, res) => {
  const ctoken = req.body.user;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    if (await token.checkToken('login', ctoken)){
      const email = await token.getEmailByToken('login', ctoken);
      if (!email){
        return res.status(200).send({fail:"Niepoprawne dane"});
      }
      const get_user = await user.checkEmail(email);
      if(!get_user){
        return res.status(200).send({fail:"Użytkownik nie istnieje"});
      }
      return res.status(200).send({success:"Użytkownik zalogowany"});
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    return res.status(500);
  }
});

app.post('/getActive', async (req, res) => {
  const ctoken = req.body.user;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    if (await token.checkToken('login', ctoken)){
      const email = await token.getEmailByToken('login', ctoken);
      if (!email){
        return res.status(200).send({fail:"Niepoprawne dane"});
      }
      const get_user = await user.checkEmail(email);
      if(!get_user){
        return res.status(200).send({fail:"Użytkownik nie istnieje"});
      }
      if(get_user.emailActivated_at == null){
        return res.status(200).send({success:false});
      }
      return res.status(200).send({success:true});
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    return res.status(500);
  }
});

app.post('/getDetails', async (req, res) => {
  const ctoken = req.body.user;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    if (await token.checkToken('login', ctoken)){
      const email = await token.getEmailByToken('login', ctoken);
      if (!email){
        return res.status(200).send({fail:"Niepoprawne dane"});
      }
      const get_user = await user.checkEmail(email);
      if(!get_user){
        return res.status(200).send({fail:"Użytkownik nie istnieje"});
      }
      return res.status(200).send({success:get_user});
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    return res.status(500);
  }
});

app.post('/getInvoices', async (req, res) => {
  const ctoken = req.body.user;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    if (await token.checkToken('login', ctoken)){
      const email = await token.getEmailByToken('login', ctoken);
      if (!email){
        return res.status(200).send({fail:"Niepoprawne dane"});
      }
      const get_user = await user.checkEmail(email);
      if(!get_user){
        return res.status(200).send({fail:"Użytkownik nie istnieje"});
      }
      const invoices = await invoice.findAll(get_user._id.toString());
      console.log("user:",get_user, "invoice:",invoices)
      return res.status(200).send({success:invoices});
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    return res.status(500);
  }
});

app.post('/getNips', async (req, res) => {
  const ctoken = req.body.user;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    if (await token.checkToken('login', ctoken)){
      const email = await token.getEmailByToken('login', ctoken);
      if (!email){
        return res.status(200).send({fail:"Niepoprawne dane"});
      }
      const get_user = await user.checkEmail(email);
      if(!get_user){
        return res.status(200).send({fail:"Użytkownik nie istnieje"});
      }
      return res.status(200).send({success:await invoice.getNIPArray(get_user._id.toString())});
    }else{
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
  }catch(error){
    return res.status(500);
  }
});

////////////////////////////////
app.post('/userSettings', async (req, res) => {
  const ctoken = req.body.user;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    const email = await token.getEmailByToken('login', ctoken);
    if (!email){
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
    const get_user = await user.checkEmail(email);
    if(!get_user){
      return res.status(200).send({fail:"Użytkownik nie istnieje"});
    }
    let data = {}
    if(req.body.details){
      data.details = get_user
    }
    if(req.body.active && get_user.emailActivated_at == null){
      data.active = true
    }
    return res.status(200).send(data);
  }catch(error){
    return res.status(500);
  }
});
////////////////////////////////

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try{
    const get_user = await user.checkEmail(email);
    if (!get_user) {
      return res.status(200).send({fail:"Konto nie istnieje"});
    }
    const passwordHash = get_user.passwordHash;
    if (await user.passwordCompare(passwordHash, password)){
      await token.addToken('login', email);
      const ctoken = await token.getTokenByEmail('login', email);
      console.log(ctoken)
      return res.status(200).send({success:ctoken});
    }
    return res.status(200).send({fail:"Niepoprawne hasło."});
  }catch(error){
    return res.status(500);
  }
});

app.post('/logout', async (req, res) => {
  const ctoken = req.body.user;
  if (ctoken){
    const email = await token.getEmailByToken('login', ctoken);
    if (email){
      token.removeToken('login', email);
      return res.send({success: "wylogowano"})
    }
  }
})

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
      res.status(200).json({ errors });
      return;
    }
  }

  
  const bir = new Bir()
  await bir.login()
  let company;
  try{
    const clientData = await bir.search({ nip: NIP })
    const newClient = new db.Client(clientData);
    await newClient.save()
    company = clientData.nazwa
  }catch(error){
    console.error(error)
    return res.status(500);
  }

  let get_user
  try{
    get_user = await user.add(company, firstName, email, password, postalCode, street, lastName, Number(phoneNumber), city, buildingNumber, apartmentNumber, Number(NIP), accountNumber);
  }catch(error){
    console.error(error)
    return res.status(500);
  }

  if (token.addToken('email', email)){
    return res.status(200).send({success:get_user._id});
  }
  return res.status(500)
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
    
    validation.check(errors.dateIssuance,req.body.dateIssuance);
    
    validation.check(errors.dateSell,req.body.dateSell);
    
    validation.check(errors.payDate,req.body.payDate);

    validation.check(errors.place,req.body.place);
    validation.text(errors.place,req.body.place);

    req.body.account = req.body.account.replace(/\s/g, '')
    validation.check(errors.account,req.body.account);
    validation.equal(errors.account,req.body.account,26);

    validation.check(errors.seller,req.body.seller);
    validation.text(errors.seller,req.body.seller);

    validation.check(errors.payType,req.body.payType);
    if (!['Przelew', 'Gotówka'].includes(req.body.payType)){
      errors.payType.push("Błędna metoda płatności")
    }

    if (req.body.services.length == 0){
      errors.services.push("Tabela nie może być pusta")
    }

    if(
      errors.clientNIP.length > 0 ||
      errors.dateIssuance.length > 0 ||
      errors.dateSell.length > 0 ||
      errors.dateSell.length > 0 ||
      errors.place.length > 0 ||
      errors.account.length > 0 ||
      errors.seller.length > 0 ||
      errors.payType.length > 0 ||
      errors.services.length > 0
    ){err=true}

    if (err){
      console.log(errors)
      res.status(200).json({ errors });
      return;
    }
  }

  const bir = new Bir()
  await bir.login()
  try{
    const clientData = await bir.search({ nip: req.body.client })
    const newClient = new db.Client(clientData);
    await newClient.save()
    req.body.clientName = clientData.nazwa
    req.body.clientNIP = clientData.nip
    req.body.clientStreet = clientData.ulica+' '+clientData.nrNieruchomosci
    clientData.nrLokalu?req.body.clientStreet+=' '+clientData.nrLokalu:null
    req.body.clientCity = clientData.kodPocztowy+' '+clientData.miejscowosc
  }catch(error){
    console.error(error)
    return res.status(500);
  }

  const date = new Date()
  const month = date.getMonth();
  const fixedMonth = String(month + 1).padStart(2, '0');
  const year = date.getFullYear();
  const counter = await invoice.count(req.body.userId,month,year);

  
  const ctoken = req.body.userId;
  const email = await token.getEmailByToken('login', ctoken);
  const checkUser = await user.checkEmail(email);

  req.body.userId = checkUser._id

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
    return res.status(500);
  }
  
  return res.status(200).json({ success: 'Dodano fakturę' });
})

app.post('/addService', (req,res) => {
  let errors = {
    name:[],
    jm:[],
    quantity:[],
    price:[],
    vat:[],
  };
  validation.check(errors.name,req.body.NAME);
  validation.text(errors.name,req.body.NAME);
  
  validation.check(errors.jm,req.body.JM);
  if (!['Usługa', 'm2'].includes(req.body.JM)){
    errors.jm.push("Błędna jednostka miary")
  }

  validation.check(errors.quantity,req.body.QUANTITY);
  validation.number(errors.quantity,req.body.QUANTITY);

  validation.check(errors.price,req.body.PRICE);
  validation.number(errors.price,req.body.PRICE);

  validation.check(errors.vat,req.body.VAT);
  if (![23, 8, 5].includes(req.body.VAT)){
    errors.vat.push("Błędna wartość vat")
  }
  
  if(
    errors.name.length > 0 ||
    errors.jm.length > 0 ||
    errors.quantity.length > 0 ||
    errors.price.length > 0 ||
    errors.vat.length > 0
  ){
    res.status(200).send({ errors });
    return;
  }

  return res.status(200).send({ success: 'Poprawne dane' });
})




app.post('/setUserSettings/loginData', async (req,res) => {
  const ctoken = req.body.user;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    const email = await token.getEmailByToken('login', ctoken);
    if (!email){
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
    const get_user = await user.checkEmail(email);
    if(!get_user){
      return res.status(500)
    }
  }catch{
    return res.status(500)
  }
  const email = req.body.email
  const password = req.body.password
  const newPassword = req.body.newPassword
  const confirmPassword = req.body.confirmPassword
  
  let errors = {
    email:[],
    password:[],
    newPassword:[],
    confirmPassword:[],
  };
  let updated = {};
  if (email != get_user.email){
    validation.check(errors.email,email);
    validation.email(errors.email,email);
    await user.emailUnique(errors.email,email);
    if(errors.email.length == 0){
      console.log("email update!")
      get_user.email = email;
      get_user.emailActivated_at = null;
      await get_user.save()
      updated.email = true;
    }
  }
  
  if (password != '' || newPassword != '' || confirmPassword != ''){
    if (!validation.check(errors.password,password)){//hasło nie jest puste
      if (!user.passwordCompare(get_user.passwordHash, password)){
        errors.password.push("Podane hasło jest niepoprawne.");
      }
    }
    if (!validation.check(errors.newPassword,newPassword)){
      validation.password(errors.newPassword,newPassword);
      validation.min(errors.newPassword,newPassword,8);
      validation.max(errors.newPassword,newPassword,20);
    }
    if (!validation.check(errors.confirmPassword,confirmPassword)){
      validation.compare(errors.confirmPassword,confirmPassword,newPassword);
    }
    if(
      errors.password.length == 0 &&
      errors.newPassword.length == 0 &&
      errors.confirmPassword.length == 0
    ){
      await user.changePassword(get_user, newPassword);
      updated.password = true;
    }
  }

  return res.status(200).json({ errors,updated });
})

app.post('/setUserSettings/personalData', async (req,res) => {
  const ctoken = req.body.user;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    const email = await token.getEmailByToken('login', ctoken);
    if (!email){
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
    const get_user = await user.checkEmail(email);
    if(!get_user){
      return res.status(500)
    }
  }catch{
    return res.status(500)
  }
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const phoneNumber = req.body.phoneNumber

  let errors = {
    firstName:[],
    lastName:[],
    phoneNumber:[],
  };
  let updated = {};

  if(firstName != get_user.firstName){
    validation.check(errors.firstName,firstName);
    validation.text(errors.firstName,firstName);
    if(errors.firstName.length == 0){
      get_user.firstName = firstName;
      await get_user.save()
      updated.firstName = true;
    }
  }

  if(lastName != get_user.lastName){
    validation.check(errors.lastName,lastName);
    validation.text(errors.lastName,lastName);
    if(errors.lastName.length == 0){
      get_user.lastName = lastName;
      await get_user.save()
      updated.lastName = true;
    }
  }

  if(phoneNumber != get_user.phoneNumber){
    validation.check(errors.phoneNumber,phoneNumber);
    validation.number(errors.phoneNumber,phoneNumber);
    validation.equal(errors.phoneNumber,phoneNumber,9);
    if(errors.phoneNumber.length == 0){
      get_user.phoneNumber = phoneNumber;
      await get_user.save()
      updated.phoneNumber = true;
    }
  }
  console.log(errors,updated)
  return res.status(200).json({ errors,updated });
})

app.post('/setUserSettings/addressData', async (req,res) => {
  const ctoken = req.body.user;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    const email = await token.getEmailByToken('login', ctoken);
    if (!email){
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
    const get_user = await user.checkEmail(email);
    if(!get_user){
      return res.status(500)
    }
  }catch{
    return res.status(500)
  }
  const postalCode = req.body.postalCode
  const city = req.body.city
  const street = req.body.street
  const buildingNumber = req.body.buildingNumber
  const apartmentNumber = req.body.apartmentNumber
  
  let errors = {
    postalCode:[],
    city:[],
    street:[],
    buildingNumber:[],
    apartmentNumber:[],
  };
  let updated = {};

  if(postalCode != get_user.postalCode){
    validation.check(errors.postalCode,postalCode);
    if(errors.postalCode.length == 0){
      get_user.postalCode = postalCode;
      await get_user.save()
      updated.postalCode = true;
    }
  }
  
  if(city != get_user.city){
    validation.check(errors.city,city);
    validation.text(errors.city,city);
    if(errors.city.length == 0){
      get_user.city = city;
      await get_user.save()
      updated.city = true;
    }
  }
  
  if(street != get_user.street){
    validation.check(errors.street,street);
    validation.text(errors.street,street);
    if(errors.street.length == 0){
      get_user.street = street;
      await get_user.save()
      updated.street = true;
    }
  }
  
  if(buildingNumber != get_user.buildingNumber){
    validation.check(errors.buildingNumber,buildingNumber);
    if(errors.buildingNumber.length == 0){
      get_user.buildingNumber = buildingNumber;
      await get_user.save()
      updated.buildingNumber = true;
    }
  }

  if(apartmentNumber != get_user.apartmentNumber){
    validation.check(errors.apartmentNumber,apartmentNumber);
    if(errors.apartmentNumber.length == 0){
      get_user.apartmentNumber = apartmentNumber;
      await get_user.save()
      updated.apartmentNumber = true;
    }
  }
    
  return res.status(200).json({ errors,updated });
})

app.post('/setUserSettings/companyData', async (req,res) => {
  const ctoken = req.body.user;
  if (!ctoken){
    return res.status(200).send({fail:"Niepoprawne dane"});
  }
  try{
    const email = await token.getEmailByToken('login', ctoken);
    if (!email){
      return res.status(200).send({fail:"Niepoprawne dane"});
    }
    const get_user = await user.checkEmail(email);
    if(!get_user){
      return res.status(500)
    }
  }catch{
    return res.status(500)
  }
  const NIP = req.body.NIP
  const accountNumber = req.body.accountNumber
  
  let errors = {
    NIP:[],
    accountNumber:[]
  };
  let updated = {};

  if(NIP != get_user.NIP){
    validation.check(errors.NIP,NIP);
    validation.number(errors.NIP,NIP);
    validation.equal(errors.NIP,NIP,10);
    await validation.nip(errors.NIP,NIP);
    errors.NIP.length == 0?await user.NIPUnique(errors.NIP,NIP):null
    if(errors.NIP.length == 0){
      get_user.NIP = NIP;
      await get_user.save()
      updated.NIP = true;
    }
  }

  if(accountNumber != get_user.accountNumber){
    validation.check(errors.accountNumber,accountNumber);
    validation.number(errors.accountNumber,accountNumber);
    validation.equal(errors.accountNumber,accountNumber,26);
    errors.accountNumber.length == 0?await user.accountNumberUnique(errors.accountNumber,accountNumber):null;
    if(errors.accountNumber.length == 0){
      get_user.accountNumber = accountNumber;
      await get_user.save()
      updated.accountNumber = true;
    }
  }

  return res.status(200).json({ errors,updated });
})



app.listen(port, () => {
  console.log(`>>>>>> Server start <<<<<<`);
});