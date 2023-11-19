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
    company: String,
    email: String,
    passwordHash: String,
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    NIP: Number,
    postalCode: String,
    city: String,
    street: String,
    buildingNumber: String,
    apartmentNumber: String,
    accountNumber: String,
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()},
    counter: {type: Number, default: 0},
    emailActivated_at: {type: Date, default: null},
});
const User = mongoose.model('User', userSchema);

const clientSchema = new mongoose.Schema({
    regon: String,
    nip: String,
    statusNip: String,
    nazwa: String,
    wojewodztwo: String,
    powiat: String,
    gmina: String,
    miejscowosc: String,
    kodPocztowy: String,
    ulica: String,
    nrNieruchomosci: String,
    nrLokalu: String,
    typ: String,
    silosID: String,
    dataZakonczeniaDzialalnosci: String,
    miejscowoscPoczty: String,
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()},
});
const Client = mongoose.model('Client', clientSchema);

const invoiceSchema = new mongoose.Schema({
    name: String,
    userId: String,
    dateIssuance: Date,
    dateSell: Date,
    place: String,
    payDate: Date,
    clientName: String,
    clientNIP: String,
    clientStreet: String,
    clientCity: String,
    payType: String,
    account: String,
    seller: String,
    services: {
      type: [
        {
          NAME:String,
          JM:String, 
          QUANTITY:Number, 
          PRICE:Number, 
          VALUEN:Number, 
          VAT:Number, 
          VATPRICE:Number, 
          VALUEB:Number
        }
      ],
    },
    totalPrice: Number,
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()},
});
const Invoice = mongoose.model('Invoice', invoiceSchema);

const tokenSchema = new mongoose.Schema({
    email: String,
    token: String,
    type: String,
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()},
});
const Token = mongoose.model('Token', tokenSchema);

module.exports = { User, Client, Invoice, Token }