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
    res.status(500).send('Wystąpił błąd podczas pobierania danych.');
  }
});


app.post('/register', async (req, res) => {
  //no query instead use body with parser
  const firstName = req.body.firstName;
  const email = req.body.email;
  const password = req.body.password;
  const postalCode = req.body.postalCode;
  const street = req.body.street;
  const lastName = req.body.lastName;
  const phoneNumber = req.body.phoneNumber;
  const confirmPassword = req.body.confirmPassword;
  const city = req.body.city;
  const houseNumber = req.body.houseNumber;
  const apartmentNumber = req.body.apartmentNumber;

  let status = 'Nie dodano';
  if (firstName && email && password && postalCode && street && lastName && phoneNumber && city && houseNumber) {
    person.add(firstName, email, password, postalCode, street, lastName, Number(phoneNumber), city, houseNumber, apartmentNumber);
    status = 'Dodano';
    //res.status(200).send('Register successful');
  }
  //res.status(500).send('Register error');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});