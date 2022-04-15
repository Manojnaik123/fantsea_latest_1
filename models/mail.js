const mongoose=require('mongoose')


const mailSchema=new mongoose.Schema({
    name:String,
    email:String,
    message:String,
})

const Mail=mongoose.model('Mail',mailSchema);

module.exports=Mail;