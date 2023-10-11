const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 8080;

//this is new \/
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
//this is new \/
app.use(cors(corsOptions)) // Use this after the variable declaration

// Importuj bibliotekę MongoDB
const mongoose = require('mongoose');

// Adres hosta bazy danych MongoDB na podstawie nazwy usługi w docker-compose.yml
const dbHost = 'database'; // To jest nazwa usługi bazy danych w docker-compose.yml

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
  login: String,
  password: String,
});
const Person = mongoose.model('Person', personSchema);
async function addPerson(login, password) {
  try {
    const person = new Person({ login, password });
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
    tableHTML += '<tr><th>Login</th><th>Hasło</th></tr>';

    const persons = await displayAllPersons();
    persons.forEach((person) => {
      tableHTML += `<tr><td>${person.login}</td><td>${person.password}</td></tr>`;
    });

    tableHTML += '</table>';

    res.send(tableHTML);
  } catch (error) {
    console.error('Błąd podczas obsługi ścieżki /login:', error);
    res.status(500).send('Wystąpił błąd podczas pobierania danych.');
  }
});

//this is new \/
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/register', async (req, res) => {
  const username = req.body.username;//no query instead use body with parser
  const password = req.body.password;
  let status = 'Nie dodano';
  if (username && password) {
    addPerson(username, password);
    status = 'Dodano';
  }
  res.redirect('/persons?status='+status);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});