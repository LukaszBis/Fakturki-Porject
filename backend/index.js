const express = require('express');
const app = express();
const port = 8080;

// Importuj bibliotekę MongoDB
const mongoose = require('mongoose');

// Adres hosta bazy danych MongoDB na podstawie nazwy usługi w docker-compose.yml
const dbHost = 'database'; // To jest nazwa usługi bazy danych w docker-compose.yml

// Połączenie z bazą danych
mongoose.connect(`mongodb://${dbHost}:27017/users`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: {
    user: 'Fakturki', // Nazwa użytkownika
    password: 'fakturki1234', // Hasło
  },
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Błąd połączenia z bazą danych:', error);
});

db.once('open', () => {
  console.log('Połączono z bazą danych MongoDB');
});

app.get('/', (req, res) => {
  res.send('Work?! Connected to MongoDB!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});