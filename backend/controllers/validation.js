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

module.exports = { check, text, email, number, equal, min, max, compare };