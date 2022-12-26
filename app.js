const express = require("express");
const hbs=require("hbs")
const path=require("path")
const mongoose=require("mongoose")
const app = express();
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


 app.use('/static',express.static('static'))
 app.set('view engine','hbs')
 app.use(express.urlencoded({ extended:false}))
 mongoose.set('strictQuery', false);
 app.set("views",path.join(__dirname,"views"))
app.get("/", (req, res)=>{ 
    res.status(200).render("index");
});
app.post("/", (req, res)=>{
    nam=req.body.name
    email=req.body.email
    password=req.body.password
    console.log(email,password);
    const us= new User({
        name:`${nam}`,
        email:`${email}`,
        password:`${password}`
    })
    us.save()
    res.render("index")
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`The application started successfully on port ${PORT}`);
});
