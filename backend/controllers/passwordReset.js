const db = require("./database");
const mail = require("./mail");

async function add(email) {
    try {
        await removeToken(email);

        let token = generateToken();
        while(await checkToken(token)){
            token = generateToken();
        }
            
        newToken = new db.PasswordReset({ 
            email, 
            token,
        });
        await newToken.save();
        console.log('Token resetowania hasła został dodany.');
        mail.sendPasswordResetLink(email, token);
        return true;
    } catch (error) {
        console.error('Błąd podczas dodawania tokenu:', error);
        return false;
    }
}
function removeToken(email) {
    db.PasswordReset.findOneAndRemove({ email: email })
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
async function getTokenByEmail(email) {
    try {
        const findToken = await db.PasswordReset.findOne({ email: email }).exec();
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
        const findEmail = await db.PasswordReset.findOne({ token: token }).exec();
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
async function checkToken(token) {
    try {
        const findToken = await db.PasswordReset.findOne({ token: token }).exec();
        if (findToken){
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas wyszukiwania adresu email:', error);
    }
}
async function checkTokens(){
    try {
        const findToken = await db.PasswordReset.findOne({ token: token }).exec();
        if (findToken){
            return true;
        }
        return false;
    } catch (error) {
        console.error('Błąd podczas wyszukiwania adresu email:', error);
    }
}
async function checkTokens() {
    const time = new Date();
    time.setMinutes(time.getMinutes() - 10);
  
    try {
        const wynik = await db.PasswordReset.deleteMany({ created_at: { $lt: time } });
        wynik>0?console.log('Usunięto', wynik.deletedCount, 'elementów.'):null;
    } catch (error) {
        console.error('Błąd podczas usuwania elementów:', error);
    }
}

module.exports = { add,getTokenByEmail,getEmailByToken,checkToken,removeToken,checkTokens };