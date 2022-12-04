/*-----------------------------------NAME VALIDATION-----------------------------------------------------*/

const isValidName = function (name){
    const nameRegex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
    return nameRegex.test(name);
};

/*-----------------------------------MOBILE NUMBER VALIDATION-------------------------------------------*/
 
const isValidMobile = function(mobile) {
    const mobileRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return mobileRegex.test(mobile);
};

/*-----------------------------------EMAIL VALIDATION-----------------------------------------------------*/
 
const isValidEmail = function(email) {
    const emailRegex =
    /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

/*-----------------------------------------PASSWORD VALIDATION-----------------------------------------------*/
 
const isValidPassword = function(password) {
    const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/;
    return passwordRegex.test(password);

};

/*-----------------------------------------PINCODE VALIDATION-----------------------------------------------*/
 
const isValidPin = function(pin) {
    const PinRegex =
    /^[1-9][0-9]{5}$/;
    return PinRegex.test(pin);

};

/*---------------------------------------------VALUE VALIDATION-------------------------------------------*/
 
const isEmpty = function (value){
    if (typeof value ==="string" && value.trim().length === 0) return false;
    if(typeof value === "undefined" || value === null ) return false
    return true;
};


/*-----------------------------------BOOK TITLE VALIDATION -----------------------------------------------------*/


const isValidBookTitle = function (name){
    const nameRegex = /^[a-zA-Z0-9:]+(([a-zA-Z0-9: ])?[a-zA-Z0-9:]*)*$/;
    return nameRegex.test(name);
};

/*---------------------------------------------ISBN VALIDATION-------------------------------------------*/
 
const isVAlidISBN = function (ISBN){
    const ISBNRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
    return ISBNRegex.test(ISBN);
    
};

/*--------------------------------------------- DATE VALIDATION-------------------------------------------*/
 
const isVAlidDate = function (releasedAt){
    const DateRegex = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
    return DateRegex.test(releasedAt);
    
};



module.exports = {isValidName, isValidMobile, isValidEmail, isValidPassword, isValidPin, isEmpty, isValidBookTitle,isVAlidISBN, isVAlidDate}