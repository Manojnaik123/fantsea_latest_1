const express=require('express')
const app=express()
const ejs=require('ejs')
const ejsMate=require('ejs-mate')
const path=require('path')
const mongoose=require('mongoose')
const Events=require('./models/events')
const Events2=require('./models/events2')
const User=require('./models/user')
const Home=require('./models/home')
const session=require('express-session')
const method=require('method-override')
const bodyParser=require('body-parser')
const passport=require('passport')
const localStrategy=require('passport-local')
const catchAsync=require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError')
const cookies=require('cookie-parser')
const Mail=require('./models/mail')
const Call=require('./models/call')

const multer=require('multer')
const {storage}=require('./cloudinary');
const { CallTracker } = require('assert')
const upload=multer({storage});
const DB = 'mongodb+srv://manoj:manoj170901@cluster0.oy2bj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

var dg = "jrfhvrjfkv";

/*app.use(cookies())
app.use(method('_method'))
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.static(path.join(__dirname,'public')));
app.engine('ejs',ejsMate)
app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true})); 
*/

app.use(session({ 
    secret: 'anything',
    resave: true,
    saveUninitialized: true
 }));

const isLogged=(req,res,next)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/login')
    }
    next();
}

const config={
    secret:"thisisasecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(config))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    next(

    )
})



mongoose.connect(DB,{useNewUrlParser:true,useUnifiedTopology: true });
const db=mongoose.connection;
db.on('error',console.error.bind(console,'error'));
db.once('open',()=>{
  console.log('database connected');
})





app.get('/home',catchAsync(async(req,res,next)=>{
    const data=await Events.find();
    if(req.cookies.user!=null){
        const cook=req.cookies.user
        return res.render('home.ejs',{data,cook})
    }
    const cook=1;
    return res.render('home.ejs',{data,cook})
    next()
}))

app.post('/home',catchAsync(async(req,res)=>{
    const {name}=req.body;
    res.cookie('user',name)
    const data=new Home(req.body);
    await data.save()
    res.redirect('/home')
}))
app.get('/',catchAsync(async(req,res,next)=>{
    const data=await Events.find();
    if(req.cookies.user!=null){
        const cook=req.cookies.user
        return res.render('home.ejs',{data,cook})
    }
    const cook=1;
    return res.render('home.ejs',{data,cook})
    next()
}))
app.post('/home',catchAsync(async(req,res,next)=>{
    const data= new Home(req.body);
    await data.save()
    next()
}))

app.get('/callback',async(req,res)=>{
    const data=await Home.find()
    const call=await Call.find();

    res.render('call.ejs',{data,call})
})


app.get('/events',catchAsync(async(req,res,next)=>{
    const data=await Events.find()   ;     
    const arr=[];
    data.forEach(lop);
    function lop(item,index){
        arr.push(item);
    }    
    return res.render('events.ejs',{arr:arr})
    next()
}))

app.get('/events2',catchAsync(async(req,res,next)=>{
    const data=await Events2.find()   ;     
    const arr=[];
    data.forEach(lop);
    function lop(item,index){
        arr.push(item);
    }    
    return res.render('events2.ejs',{arr:arr})
    // res.render('events2.ejs')
    next()
}))

app.get('/addevents',isLogged,(req,res)=>{
    res.render('addevents.ejs')
})
app.post('/addevents',upload.array('image'),catchAsync(async(req,res)=>{
    

    if(!req.body.data) throw new ExpressError('invalid event data',400)
    const data=new Events(req.body)
    data.images=req.files.map(f =>({url: f.path,filename:f.filename}))
    await data.save()
    console.log(data)
    res.redirect('/addevents')

    
    // res.send('it worked')
    
}))

app.get('/addevents2',isLogged,(req,res)=>{
    res.render('addevents2.ejs')
})
app.post('/addevents2',upload.array('image'),catchAsync(async(req,res)=>{

    const data=new Events2(req.body)
    data.images=req.files.map(f =>({url: f.path,filename:f.filename}))
    await data.save()
    res.redirect('/addevents2')
    
}))

app.get('/about',(req,res)=>{
    res.render('about.ejs')
})

app.get('/contact',(req,res)=>{
    res.render('contact.ejs')
})

app.post('/contact',async(req,res)=>{
    const data=new Mail(req.body);
    await data.save()
    
    res.redirect('/contact')
})

app.get('/mail',async(req,res)=>{
    const data=await Mail.find()
    res.render('mail.ejs',{data})
})

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.post('/logout',(req,res)=>{
    req.logout()
    res.redirect('/home')
})

app.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),(req,res)=>{
    
    res.redirect('/home')
})


app.get('/signup',(req,res)=>{
    res.render('signup.ejs')
})

app.post('/signup',catchAsync(async(req,res,next)=>{
    const {username,email,password}=req.body;
    const user=new User({email,username});
    const signed=await User.register(user,password)
    // console.log(signed)
    res.redirect('/home')
    next()
}))

app.get('/events/:id',catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const data=await Events.findById(id)
    return res.render('eventsshow.ejs',{data})
    next()
}))

app.post('/events/:id',catchAsync(async(req,res,next)=>{
    const {id}=req.params;
    console.log(req.body)
    const data=new Call(req.body)
    await data.save()
    return res.redirect(`/events/${id}`)
    next()
}))

app.get('/events2/:id',catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const data=await Events2.findById(id)
    return res.render('events2show.ejs',{data})
    next()
}))

app.post('/events2/:id',catchAsync(async(req,res,next)=>{
    const {id}=req.params;
    console.log(req.body)
    const data=new Call(req.body)
    await data.save()
    return res.redirect(`/events2/${id}`)
    next()
}))

app.delete('/events/:id',catchAsync(async(req,res,next)=>{
    const {id}=req.params;
    await Events.findByIdAndDelete(id);
    res.redirect('/events')
    next()
}))
app.delete('/events2/:id',catchAsync(async(req,res,next)=>{
    const {id}=req.params;
    await Events2.findByIdAndDelete(id);
    res.redirect('/events2')
    next()
}))

app.delete('/callback/:id',async(req,res)=>{
    const {id}=req.params;
    await Home.findByIdAndDelete(id);
    res.redirect('/callback')
})

app.delete('/mail/:id',async(req,res)=>{
    const {id}=req.params;
    await Mail.findByIdAndDelete(id);
    res.redirect('/mail')
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404))
})
app.use((err,req,res,next)=>{
    const {status=500 }=err;
    if(!err.status) err.status=500
    if(!err.message) err.message='On No ,Something went wrong'
    res.status(status)
    res.render('error',{err})
    
})

app.listen(3000,(req,res)=>{
    console.log('listening on 3001')
})