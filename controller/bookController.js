//const moment = require('moment')
const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')

//let {isValidName,isEmpty} = validation

//============================ create book===============================
exports.createBook = async function(req,res){
    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt, isDeleted } = data
        if(Object.keys(data).length = 0){res.status(400).send({status : false, msg:"All fields are mandatory"})}
        if(!title){return res.status(400).send({status : false, msg:"provide title"})}
        if(!excerpt){return res.status(400).send({status : false, msg:"provide experpt"})}
        if(!userId){return res.status(400).send({status : false, msg:"provide userId"})}
        if(!ISBN){return res.status(400).send({status : false, msg:"provide Isbn"})}
        if(!category){return res.status(400).send({status : false, msg:"provide category"})}
        if(!subcategory){return res.status(400).send({status : false, msg:"provide subcategory"})}

        

        
        
        let checkUserId = await userModel.findById(userId)
        if(!checkUserId){return res.status(404).send({status : false, msg:"user not find"})}

        let createBook = await bookModel.create(data)
       // data.releasedAt = moment.format(yyyy/mm/dd)

        res.status(201).send({ status: true, message: `This ${title} Book is created sucessfully.`, data: createBook })
        
    } catch (error) {
        return res.status(500).send({status : false, msg: error.message})
    }
}
