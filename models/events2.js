const mongoose=require('mongoose')


const events2Schema=new mongoose.Schema({
    title:String,
    price:Number,
    description:String,
    food:String,
    drink:String,
    speaker:String,
    butler:String,
    parking:String,
    images:[
        {
            url:String,
            filename:String
        }
    ]
})

const Event2=mongoose.model('Event2',events2Schema);

module.exports=Event2;