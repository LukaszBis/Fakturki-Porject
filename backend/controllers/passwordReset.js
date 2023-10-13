const mongoose = require('mongoose');
const mail = require("./mail");
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

const passwordResetSchema = new mongoose.Schema({
    email: String,
    token: String,
    created_at: Date,
    updated_at: Date,
});
const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

function add(email) {
    try {
        const token = "token :D";
        const created_at = new Date();
        const updated_at = new Date();
        PasswordReset.findOneAndRemove({ email: email })
            .then((doc) => {
                if (doc) {
                    console.log('Usunięto element o adresie e-mail:', email);
                } else {
                    console.log('Nie znaleziono elementu o adresie e-mail:', email);
                }
            })
            .catch((err) => {
                console.error('Błąd podczas usuwania elementu:', err);
            });
            
        newToken = new PasswordReset({ 
            email, 
            token, 
            created_at, 
            updated_at 
        });
        newToken.save();
        console.log('Token resetowania hasła został dodany.');
        mail.send(email, token);
        return true;
    } catch (error) {
        console.error('Błąd podczas dodawania tokenu:', error);
        return false;
    }
}
async function getTokenByEmail(email) {
    try {
        const findToken = await PasswordReset.findOne({ email: email }).exec();
        if (findToken){
            console.log('Znaleziony token:', findToken.token);
        }else{
            console.log('Nie znaleziono tokenu dla: ', email);
        }
        return findToken.token;
    } catch (error) {
        console.error('Błąd podczas wyszukiwania tokenu:', error);
    }
}
async function getEmailByToken(token) {
    try {
        const findEmail = await PasswordReset.findOne({ token: token }).exec();
        if (findEmail){
            console.log('Znaleziony email:', findEmail.email);
        }else{
            console.log('Nie znaleziono emailu dla: ', token);
        }
        return findEmail.email;
    } catch (error) {
        console.error('Błąd podczas wyszukiwania adresu email:', error);
    }
}

module.exports = { add,getTokenByEmail,getEmailByToken };