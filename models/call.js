const mongoose=require('mongoose')


const callSchema=new mongoose.Schema({
    number:Number
})

const Call=mongoose.model('Call',callSchema);

module.exports=Call;