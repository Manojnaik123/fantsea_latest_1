const mongoose=require('mongoose')
passportLocalMongoose=require('passport-local-mongoose');


const UserSchema=new mongoose.Schema({
    email:String,
})

UserSchema.plugin(passportLocalMongoose);



const User=mongoose.model('User',UserSchema)

module.exports=User;