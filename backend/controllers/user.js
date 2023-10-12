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

const userSchema = new mongoose.Schema({
    firstName: String,
    email: String,
    password: String,
    postalCode: String,
    street: String,
    lastName: String,
    phoneNumber: Number,
    city: String,
    buildingNumber: String,
    apartmentNumber: String,
    NIP: Number,
});
const User = mongoose.model('User', userSchema);


async function add(firstName, email, password, postalCode, street, lastName, phoneNumber, city, buildingNumber, apartmentNumber, NIP) {
    let user;
    try {
        user = new User({ firstName, email, password, postalCode, street, lastName, phoneNumber, city, buildingNumber, apartmentNumber, NIP });
        await user.save();
        console.log('Osoba została dodana do bazy danych.');
    } catch (error) {
        console.error('Błąd podczas dodawania osoby:', error);
    }
    return user;
}
async function get(email, password) {
    try {
        const user = await User.findOne({ email: email, password: password }).exec(); // Pobierz wszystkie osoby z bazy danych
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
        const users = await User.find().exec(); // Pobierz wszystkie osoby z bazy danych
        console.log('Wszystkie osoby w bazie danych:', users);
        return users;
    } catch (error) {
        console.error('Błąd podczas pobierania osób:', error);
        throw error;
    }
}

module.exports = { add,get,displayAll };