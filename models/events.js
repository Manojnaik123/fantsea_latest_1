const mongoose=require('mongoose')


const eventsSchema=new mongoose.Schema({
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

const Event=mongoose.model('Event',eventsSchema);

module.exports=Event;