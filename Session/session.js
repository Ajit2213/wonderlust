const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');

const app = express();

// Configure session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set 'secure: true' if using HTTPS
}));

// Use flash middleware
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use((req,res,next)=>{
      res.locals.messages=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

app.get("/register", (req, res) => {
    let { name } = req.query;
    console.log(`Welcome ${name}`);
    req.session.name = name;
    if(name==="anonymos"){
        req.flash("error", "register- Notsuccessful");
        
    }else{
        req.flash("success", "register-successful");
    }
    console.log(req.session.name);
    res.redirect("/back");
});

app.get("/back", (req, res) => {
    
//   res.locals.messages=req.flash("success");
//   res.locals.error=req.flash("error");
    res.render("page", { name: req.session.name });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
