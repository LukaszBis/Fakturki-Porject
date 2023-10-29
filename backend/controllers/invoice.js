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
    client: String,
    dateIssuance: Date,
    dateSell: Date,
    place: String,
    payDate: Date,
    // clientName: String,
    // clientNIP: String,
    // clientStreet: String,
    // clientCity: String,
    payType: String,
    account: Number,
    seller: String,
    totalPrice: Number,
    services: [
        {
            id: Number,
            name: String,
            jm: String,
            qantity: Number,
            price: Number,
            valuen: Number,
            vat: Number,
            vatprice: Number,
            valueb: Number,
        }
    ],
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()},
});
const Invoice = mongoose.model('Invoice', invoiceSchema);

async function add(invoice) {
    let newInvoice;
    try {
        newInvoice = new Invoice(invoice);
        await newInvoice.save();
        console.log('Osoba została dodana do bazy danych.');
    } catch (error) {
        console.error('Błąd podczas dodawania osoby:', error);
    }
    return newInvoice;
}

module.exports = { add };