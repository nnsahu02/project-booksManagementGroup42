const validation = require('../validation/validation')

const jwt = require('jsonwebtoken')

const userModel = require('../model/userModel')


let {isValidName, isValidMobile, isValidEmail, isValidPassword, isValidPin, isEmpty} = validation //Destructuring


const createUser = async function(req,res){ 

    try{
        let data = req.body

    if(Object.keys(data).length==0){// Checking body is empty or not
        return res.status(400).send({status:false,message:"Body is empty"})
    }

    let {title,name,phone,email,password,address,...rest} = data //Destructuring

    if(!title||!name||!phone||!email||!password||!address||!address.street||!address.city||!address.pincode) {
        return res.status(400).send({status:false,message:"All fields must be required"})
    }

    if(Object.keys(rest).length!=0){ //Checking extra attributes are added or not 
        return res.status(400).send({msg:"Not allowed to add extra attributes"})
    }

    
    /*----------------Checking Valid Title or Not-------------------*/

    if(title != "Mr" && title != "Mrs" && title != "Miss"){ //Title checking
        return res.status(400).send({msg:"Not have appropiate title"})
    }


/*------------------------Checking attributes are empty or not-----------------------------------*/

    if(!isEmpty(title)){
        return res.status(400).send({status:false,message:"Title is required"})
    }
    if(!isEmpty(name)){
        return res.status(400).send({status:false,message:"Name is required"})
    }
    if(!isEmpty(phone)){
        return res.status(400).send({status:false,message:"Phone Number  is required"})
    }
    if(!isEmpty(email)){
        return res.status(400).send({status:false,message:"Email is required"})
    }
    if(!isEmpty(password)){
        return res.status(400).send({status:false,message:"Password is required"})
    }
    if(!isEmpty(address)){
        return res.status(400).send({status:false,message:"Address is required"})
    }
    if(!isEmpty(address.street)){
        return res.status(400).send({status:false,message:"Street is required"})
    }
    if(!isEmpty(address.city)){
        return res.status(400).send({status:false,message:"City is required"})
    }
    if(!isEmpty(address.pincode)){
        return res.status(400).send({status:false,message:"Pin Code is required"})
    }

    
    if(!isValidName(name)){ // Name validation
        return res.status(400).send({status:false,message:"Name is Wrong"})
    }

    if(!isValidMobile(phone)){  // Phone validation
        return res.status(400).send({status:false,message:"Phone Number is wrong"})
    }

    let duplicatePhone = await userModel.findOne({phone:data.phone}) //Duplicate Phone no checking
    if(duplicatePhone){
        return res.status(200).send({msg:"Phone Number already registered"})
    }

    if(!isValidEmail(email)){ // Email validation
        return res.status(400).send({status:false,message:"Please provide valid Email"})
    }

    let duplicateEmail = await userModel.findOne({email:email}) //Duplicate Email checking
    if(duplicateEmail){
        return res.status(200).send({msg:"Email already registered"})
    }

    if(!isValidPassword(password)){ // Password validation
        return res.status(400).send({status:false,message:"Your password must have 8 to 15 characters, contain at least one number or symbol, and have a mixture of uppercase and lowercase letters."})
    }

    if(!isValidPin(data.address.pincode)){
        return res.status(400).send({status:false,message:"Please provide valid Pin Code"})
    }
    
    /*-----------------------------------CREATING USER-----------------------------------------------------*/

    let userCreate = await userModel.create(data)
    res.status(201).send({status:true,data:userCreate})
    }
    catch(error){
          res.status(500).send({status:true,message:error.message})
    }
    
}

module.exports.createUser = createUser



/* -------------------------------------------LOGIN---------------------------------------------- */


const login = async function (req, res) {

    try{

        let email = req.body.email;
        let password = req.body.password;

    if(!isValidEmail(email)){ // Email validation
        return res.status(400).send({status:false,message:"Please provide valid Email"})
    }

    if(!isValidPassword(password)){ // Password validation
        return res.status(400).send({status:false,message:"Your password must have Eight characters, contain at least one number or symbol, and have a mixture of uppercase and lowercase letters."})
    }
  
    let user = await userModel.findOne( { email: email, password: password } );
    if (!user)
      return res.send( { status: false, msg: "email or password is not corerct" } );
  
    let token = jwt.sign(
      {
        userId: user._id.toString(),
        batch: "Lithium",
        organisation: "FunctionUp",
        name:"Raj Nagwanshi"
      },
      "functionup-lithium-very-very-secret-key",
      {expiresIn: '15s'}
    );
    console.log(token)
    res.setHeader("x-auth-token", token);
    res.status(200).send({ status: true, token: token });

    }
      catch(error){
        res.status(500).send({msg:error.message})
      }
    
  };

  module.exports.login = login 