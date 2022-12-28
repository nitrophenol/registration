const express = require("express");
const hbs=require("hbs")
const path=require("path")
const mongoose=require("mongoose")
const nodemailer=require("nodemailer")
const app = express();
var transport=nodemailer.createTransport(
  {
    service:'gmail',
    auth:{
      user:'raccon484@gmail.com',
      pass:'zrexhqvgbmzhuvag'


    }
  }
)
const uri = require('./config/key').mongoURI;
mongoose.connect(uri, {useNewUrlParser:true})
.then(()=>console.log('hey'))
.catch(err=>console.log(err))
const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },

  });
  const User = mongoose.model('User', UserSchema);
 
const port = 80;
 app.use('/static',express.static('static'))
 app.set('view engine','hbs')
 app.use(express.urlencoded({ extended:false}))
 mongoose.set('strictQuery', false);
 app.set("views",path.join(__dirname,"views"))
app.get("/", (req, res)=>{ 
    res.status(200).render("index");
});
app.get("/login",(req,res)=>{
  res.render("login")
})
const otp=Math.floor(Math.random()*10*10*10*10)
a=[]

app.post("/", (req, res)=>{
    nam=req.body.name
    email=req.body.email
    password=req.body.password
    a.push(nam)
    a.push(email)
    a.push(password)

    
    
    var mail={
      from:'raccon484@gmail.com',
      to: `${email}`,
      subject:'otp',
      text: `Your OTP is ${otp}` 
    }
    transport.sendMail(mail,function(err,info){
      if(err){
        console.log(err)
        res.render("index")
      }
      else{
        console.log(info)
        
      }
    })
    User.find({ email: `${email}`})
    .then((doc)=>{
      if(doc.length==0)
      {
        console.log("registered")
        res.render("otp")
      }
      else
      {
        res.send(`Already Registered ` )
        
      }
    })
    .catch((err) => console.log(err))
    
});


app.post( "/verification", (req, res) =>
{
 
  b=req.body.otp
  if(otp==b)
  {
    const us= new User({
      name:`${a[0]}`,
      email:`${a[1]}`,
      password:`${a[2]}`
  })
  us.save()
  a.pop()
  a.pop()
  a.pop()
    res.render("login")
  }
  else
  {
  
    res.send("wrong otp")
  }
}
);

app.post("/login",(req,res)=>{
  email=req.body.email;
  password=req.body.password;

  User.find({ email: `${email}`})
  .then((doc)=>{
    if(doc.length==0)
    {
     res.send(`Not registered`)
    }
    else if(doc[0].password==password)
    {
      
      res.send("logged in")
      
    }
    else
    {
      res.send("wrong password")
    }

  })
  .catch((err) => console.log(err))

})

app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});
