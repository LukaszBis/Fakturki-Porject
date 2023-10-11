const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express();
const port = 8080;
// Adres hosta bazy danych MongoDB na podstawie nazwy usługi w docker-compose.yml
const dbHost = 'database'; // To jest nazwa usługi bazy danych w docker-compose.yml

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
// Połączenie z bazą danych
mongoose.connect(`mongodb://${dbHost}:27017/faktury`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Błąd połączenia z bazą danych:', error);
});
db.once('open', () => {
  console.log('Połączono z bazą danych MongoDB');
});






const personSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  password: String,
  postalCode: String,
  street: String,
  lastName: String,
  phoneNumber: Number,
  city: String,
  houseNumber: String,
  apartmentNumber: String,
});
const Person = mongoose.model('Person', personSchema);


async function addPerson(firstName, email, password, postalCode, street, lastName, phoneNumber, city, houseNumber, apartmentNumber) {
  try {
    const person = new Person({ firstName, email, password, postalCode, street, lastName, phoneNumber, city, houseNumber, apartmentNumber });
    await person.save();
    console.log('Osoba została dodana do bazy danych.');
  } catch (error) {
    console.error('Błąd podczas dodawania osoby:', error);
  }
}
async function displayAllPersons() {
  try {
    const persons = await Person.find().exec(); // Pobierz wszystkie osoby z bazy danych
    console.log('Wszystkie osoby w bazie danych:', persons);
    return persons;
  } catch (error) {
    console.error('Błąd podczas pobierania osób:', error);
    throw error;
  }
}

app.get('/', (req, res) => {
  res.send('Work?! Connected to MongoDB!');
});
app.get('/persons', async (req, res) => {
  try {
    let tableHTML = req.query.status+'<br><table>';
    tableHTML += '<tr><th>Email</th><th>Imię</th><th>Nazwisko</th></tr>';

    const persons = await displayAllPersons();
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
    addPerson(firstName, email, password, postalCode, street, lastName, Number(phoneNumber), city, houseNumber, apartmentNumber);
    status = 'Dodano';
    //res.status(200).send('Register successful');
  }
  //res.status(500).send('Register error');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});