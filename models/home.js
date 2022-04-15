const mongoose=require('mongoose')


const homeSchema=new mongoose.Schema({
    name:String,
    email:String,
    number:Number
})

const Home=mongoose.model('Home',homeSchema);

module.exports=Home;