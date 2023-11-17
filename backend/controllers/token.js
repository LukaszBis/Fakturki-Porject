const db = require("./database");
const mail = require("./mail");

async function addToken(type, email) {
    try {
        if (type != 'login'){
            await removeToken(type, email);
        }

        let token = generateToken();
        while(await checkToken(type, token)){
            token = generateToken();
        }
            
        newToken = new db.Token({ 
            email,
            token,
            type,
        });
        await newToken.save();
        console.log('Token <'+type+'> dodany na email '+email+'.');

        if (type == 'password'){
            mail.sendPasswordResetLink(email, token);
        }else if (type == 'email'){
            mail.sendActivationLink(email, token);
        }
        return true;
    } catch (error) {
        console.error('Błąd podczas dodawania tokenu:', error);
        return false;
    }
}
function removeToken(type, email) {
    db.Token.findOneAndRemove({ type: type, email: email })
        .then((doc) => {
            if (doc) {
                console.log('Usunięto element <'+type+'> o adresie e-mail:', email);
            } else {
                console.log('Nie znaleziono elementu o adresie e-mail:', email);
            }
        })
        .catch((err) => {
            console.error('Błąd podczas usuwania elementu:', err);
        });
}
function generateToken() {
    const signs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
  
    for (let i = 0; i < 30; i++) {
        const randomIndex = Math.floor(Math.random() * signs.length);
        token += signs.charAt(randomIndex);
    }
  
    return token;
}
async function getTokenByEmail(type, email) {
    try {
        const findToken = await db.Token.findOne({ type: type, email: email }).exec();
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
async function getEmailByToken(type, token) {
    try {
        const findEmail = await db.Token.findOne({ type: type, token: token }).exec();
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
async function checkToken(type, token) {
    try {
        const findToken = await db.Token.findOne({ type: type, token: token }).exec();
        if (findToken){
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas wyszukiwania adresu email:', error);
    }
}
async function removeOld(type, min) {
    const time = new Date();
    time.setMinutes(time.getMinutes() - min);
  
    try {
        const wynik = await db.Token.deleteMany({ type: type, created_at: { $lt: time } });
        wynik>0?console.log('Usunięto', wynik.deletedCount, 'elementów.'):null;
    } catch (error) {
        console.error('Błąd podczas usuwania elementów:', error);
    }
}

module.exports = { addToken,getTokenByEmail,getEmailByToken,checkToken,removeToken,removeOld };