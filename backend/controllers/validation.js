function check(arr, value) {
    if (value == null || value.trim() == ''){
        arr.push("Warość nie może być pusta");
        return true;
    }
    return false;
}
function text(arr, value) {
    const pattern = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
    if (!pattern.test(value)){
        arr.push("Wartość może składać się tylko z liter.");
        return true;
    }
    return false;
}
function email(arr, value) {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(value)){
        arr.push("Nie poprawna składnia adresu email.");
        return true;
    }
    return false;
}
function password(arr, value) {
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).+$/;

    if (!pattern.test(value)){
        arr.push("Hasło musi składać zwierać przynajmniej jedną dużą literę, jedną małą literę, jedną cyfre, jeden znak specjalny.");
        return true;
    }
    
    return false;
}
function number(arr, value) {
    if (!Number(value)){
        arr.push("Wartość musi być liczbą.");
        return true;
    }
    return false;
}
function equal(arr, value, number) {
    if (value.length != number){
        arr.push("Wartość musi składać się z "+number+" znaków");
        return true;
    }
    return false;
}
function min(arr, value, number) {
    if (value.length < number){
        arr.push("Wartość musi składać się z conajmniej "+number+" znaków");
        return true;
    }
    return false;
}
function max(arr, value, number) {
    if (value.length > number){
        arr.push("Wartość musi składać się z maksymalnie "+number+" znaków");
        return true;
    }
    return false;
}
function compare(arr, value, value2) {
    if (value != value2){
        arr.push("Podane dane różnią się od siebie");
        return true;
    }
    return false;
}
async function nip(arr, nip) {
    const axios = require('axios');
    try {
        const inputDate = new Date();
        const year = inputDate.getFullYear();
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
        const day = inputDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const apiUrl = `https://wl-api.mf.gov.pl/api/search/nip/${nip}?date=${formattedDate}`;
    
        const response = await axios.get(apiUrl);
  
        if (response.data) {
            // Przedsiębiorstwo o podanym NIP istnieje
            console.log("jest",response.data)
        } else {
            // Przedsiębiorstwo o podanym NIP nie istnieje
            arr.push("Przedsiębiorstwo o podanym NIP nie istnieje");
            console.log("niema1")
        }
    } catch (error) {
        arr.push("Przedsiębiorstwo o podanym NIP nie istnieje");
        console.log("niema2")
        //console.error('Błąd podczas pobierania danych:', error);
    }
}

module.exports = { check, text, email, password, number, equal, min, max, compare, nip };