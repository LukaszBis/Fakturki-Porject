const express = require('express');
const bodyParser = require('body-parser')
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





const person = require("./controllers/person");

app.get('/', (req, res) => {
  res.send('Work?! Connected to MongoDB!');
});
app.get('/persons', async (req, res) => {
  try {
    let tableHTML = req.query.status+'<br><table>';
    tableHTML += '<tr><th>Email</th><th>Imię</th><th>Nazwisko</th></tr>';

    const persons = await person.displayAll();
    persons.forEach((person) => {
      tableHTML += `<tr><td>${person.email}</td><td>${person.firstName}</td><td>${person.lastName}</td></tr>`;
    });

    tableHTML += '</table>';

    res.send(tableHTML);
  } catch (error) {
    console.error('Błąd podczas obsługi ścieżki /login:', error);
    res.status(400).send('Wystąpił błąd podczas pobierania danych.');
  }
});


app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await person.get(email, password);
  if (user) {
    res.status(200).send({user_id:user._id});
  }
  res.status(400);
});
app.post('/register', async (req, res) => {
  //no query instead use body with parser
  let error_firstname = '';
  let error_email = '';
  const firstName = req.body.firstName;
  if (!firstName){
    error_firstname + "Puste,";
  }else{
    error_firstname + "Imie musi byc 3 znaki,";
  }
  const email = req.body.email;
  if (!email){
    error_email + "Puste,";
  }else{
    error_email + "Email musi byc 3 znaki,";
  }
  res.send({all_errors:{error_firstname, error_email}});

  const password = req.body.password;
  const postalCode = req.body.postalCode;
  const street = req.body.street;
  const lastName = req.body.lastName;
  const phoneNumber = req.body.phoneNumber;
  const confirmPassword = req.body.confirmPassword;
  const city = req.body.city;
  const houseNumber = req.body.houseNumber;
  const apartmentNumber = req.body.apartmentNumber;

  if (firstName && email && password && postalCode && street && lastName && phoneNumber && city && houseNumber) {
    const user = await person.add(firstName, email, password, postalCode, street, lastName, Number(phoneNumber), city, houseNumber, apartmentNumber);
    //response variable
    //res.status(200).send({user-firstname:firstName});
    //response json
    //res.status(200).json({user_data:user});
    res.status(200).send({user_id:user._id});
  }
  res.status(400);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});