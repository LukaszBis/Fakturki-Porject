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


async function add(firstName, email, password, postalCode, street, lastName, phoneNumber, city, houseNumber, apartmentNumber) {
    let person;
    try {
        person = new Person({ firstName, email, password, postalCode, street, lastName, phoneNumber, city, houseNumber, apartmentNumber });
        await person.save();
        console.log('Osoba została dodana do bazy danych.');
    } catch (error) {
        console.error('Błąd podczas dodawania osoby:', error);
    }
    return person;
}
async function get(email, password) {
    try {
        const user = await Person.findOne({ email: email, password: password }).exec(); // Pobierz wszystkie osoby z bazy danych
        if (user){
            console.log('Znaleziony użytkownik:', user);
        }else{
            console.log('Nie znaleziono użytkownika: ', email);
        }
        return user;
    } catch (error) {
        console.error('Błąd podczas pobierania osób:', error);
        throw error;
    }
}
async function displayAll() {
    try {
        const persons = await Person.find().exec(); // Pobierz wszystkie osoby z bazy danych
        console.log('Wszystkie osoby w bazie danych:', persons);
        return persons;
    } catch (error) {
        console.error('Błąd podczas pobierania osób:', error);
        throw error;
    }
}

module.exports = { add,get,displayAll };