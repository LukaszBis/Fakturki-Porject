const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
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

const invoiceSchema = new mongoose.Schema({
    payDate: Date,
    place: String,
    dateSell: Date,
    dateIssuance: Date,
    clientName: String,
    clientNIP: String,
    clientStreet: String,
    clientCity: String,
    payType: String,
    account: Number,
    seller_id: String,
    totalPrice: Number,
    services: [
        {
            jm: String,
            name: String,
            price: Number,
            qantity: Number,
            valueb: Number,
            valuen: Number,
            vat: Number,
            batprice: Number,
        }
    ],
    created_at: Date,
    updated_at: Date,
});
const Invoice = mongoose.model('Invoice', invoiceSchema);

async function add(firstName, email, password, postalCode, street, lastName, phoneNumber, city, buildingNumber, apartmentNumber, NIP) {
    let user;
    try {
        const created_at = new Date();
        const updated_at = new Date();
        const emailActivated_at = null;
        const passwordHash = await bcrypt.hash(password, 10);
        user = new Invoice({ 
            email, 
            passwordHash, 
            firstName, 
            lastName, 
            phoneNumber, 
            NIP, 
            postalCode, 
            city, 
            street, 
            buildingNumber, 
            apartmentNumber,
            emailActivated_at,
            created_at, 
            updated_at 
        });
        await user.save();
        console.log('Osoba została dodana do bazy danych.');
    } catch (error) {
        console.error('Błąd podczas dodawania osoby:', error);
    }
    return user;
}

module.exports = { add };