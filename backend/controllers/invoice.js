const db = require("./database");
const { ObjectId } = require('mongodb');

async function add(invoice) {
    let newInvoice;
    try {
        newInvoice = new db.Invoice(invoice);
        await newInvoice.save();
        console.log('Faktura została dodana do bazy danych.');
    } catch (error) {
        console.error('Błąd podczas dodawania faktury:', error);
    }
    return newInvoice;
}

async function remove(id){
    db.Invoice.findByIdAndRemove(id)
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
        return await db.Invoice.find({ userId: id }).exec();
    } catch (error) {
        console.error('Błąd podczas pobierania faktur:', error);
    }
}

async function count(userid, month, year) {
    try {
        return await db.Invoice
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

async function getById(id){
    try {
        return db.Invoice.findOne({_id : new ObjectId(id)}).exec();
    } catch (error) {
        console.error('Błąd podczas pobierania faktury:', error);
        throw error;
    }
}

async function getNIPArray(id) {
    try {
        return [...new Set((await db.Invoice.find({ userId: id }).exec()).map(item => item.clientNIP))];
    } catch (error) {
        console.error('Błąd podczas pobierania faktur:', error);
    }
}

module.exports = { add,remove,findAll,count,getById,getNIPArray };