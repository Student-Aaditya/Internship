require("dotenv").config();


const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");

/*PASSWORD CONNECTION*/
const passport = require("passport");
const localstatergy = require("passport-local")

/*mongo connection*/
const mongoose = require("mongoose");
const User = require("./Model/User.js");
const session = require("express-session");
const ejsMate = require("ejs-mate");

const flash = require("connect-flash");



app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().
    then(() => {
        console.log("sucessful connection");
    }).catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/NLSAT");

}

const sessionOption = ({
    secret: "musecretcode",
    resave: false,
    saveUninitialized: true,
})

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstatergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/sign", (req, res) => {
    res.render("./Auth/Sign.ejs");
})
app.post("/sign", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ username, email });
        const regis = await User.register(newuser, password);
        res.redirect("/");
    } catch (err) {
        console.error(err);
    }
})
app.get("/login", (req, res) => {
    
    res.render("./Auth/Login.ejs");
})

app.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("sucess","login sucessful");
    res.redirect("/");
})

app.get("/logout", (req, res) => {
    try {
        req.logOut((err) => {
            if (err) {
                nextTick(err);
            }
            res.redirect("/");
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send("please fill the data");
    }
})

app.get("/crash",(req,res)=>{
    res.render("crash.ejs");
})


app.listen(6015,(req,res)=>{
    console.log("server working on port 6015");
})