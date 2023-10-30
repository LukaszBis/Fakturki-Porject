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
    totalPrice: Number,
    services: [
        {
            ID: Number,
            NAME: String,
            JM: String,
            QANTITY: Number,
            PRICE: Number,
            VALUEN: Number,
            VAT: Number,
            VATPRICE: Number,
            VALUEB: Number,
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
        console.log('Faktura została dodana do bazy danych.');
    } catch (error) {
        console.error('Błąd podczas dodawania faktury:', error);
    }
    return newInvoice;
}

async function remove(id){
    Invoice.findByIdAndRemove(id)
    .then(() => {
        return true;
    })
    .catch((error) => {
        console.error(error)
        return false;
    })
}

async function findAll(id) {
    try {
        return await Invoice.find({ userId: id }).exec();
    } catch (error) {
        console.error('Błąd podczas pobierania faktur:', error);
    }
}

async function count(userid, month, year) {
    try {
        return await Invoice
        .find({
          userId: userid,
          $expr: {
            $eq: [{ $month: '$created_at' }, month + 1],
            $eq: [{ $year: '$created_at' }, year]
          }
        })
        .countDocuments();
    } catch (error) {
        console.error('Błąd podczas pobierania faktur:', error);
    }
}

module.exports = { add,remove,findAll,count };