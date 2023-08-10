const express = require('express');
const router = express.Router();
const User=require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');
var transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
    user:'walhamohamed365@gmail.com',
    pass:'larjhlhczipojrlg'
    },
    tls:{
    rejectUnauthorized:false
    }
    })
// créer un nouvel utilisateur
router.post('/register', async (req, res) => {
try {
let { email, password, firstname, lastname } = req.body
const user = await User.findOne({ email })
if (user) return res.status(404).send({ success: false, message:

"User already exists" })

const newUser = new User({ email, password, firstname, lastname })
const createdUser = await newUser.save()
// Envoyer l'e-mail de confirmation de l'inscription
var mailOption ={
    from: '"verify your email " <walhamohamed365@gmail.com>',
    to: newUser.email,
    subject: 'vérification your email ',
    html:`<h2>${newUser.firstname}! thank you for registreting on our website</h2>
    <h4>please verify your email to procced.. </h4>
    <a
    href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">click
    here</a>`
    }
    transporter.sendMail(mailOption,function(error,info){
    if(error){
    console.log(error)
    }
    else{
    console.log('verification email sent to your gmail account ')
    }
    })
return res.status(201).send({ success: true, message: "Account created successfully", user: createdUser })
} catch (err) {
console.log(err)
res.status(404).send({ success: false, message: err })
}
});
// afficher la liste des utilisateurs.
router.get('/', async (req, res, )=> {
    try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    
    });
    /**
* as an admin i can disable or enable an account
*/
router.get('/status/edit/', async (req, res) => {
    try {
    let email = req.query.email
    let user = await User.findOne({email})
    user.isActive = !user.isActive
    user.save()
    res.status(200).send({ success: true, user })
    } catch (err) {
    return res.status(404).send({ success: false, message: err })
    }
    })
    // se connecter
router.post('/login', async (req, res) => {
    try {
    let { email, password } = req.body
    
    if (!email || !password) {
    
    
    return res.status(404).send({ success: false, message: "Allfields are required" })
    
    }
    
    let user = await User.findOne({ email}).select('+password').select('+isActive')
    
    if (!user) {
    
    return res.status(404).send({ success: false, message: "Accountdoesn't exists" })
    
    } else {
    
    let isCorrectPassword = await bcrypt.compare(password, user.password)
    if (isCorrectPassword) {
    
    delete user._doc.password
    if (!user.isActive) return res.status(200).send({ success:
    
    false, message: 'Your account is inactive, Please contact your administrator' })
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    
    return res.status(200).send({ success: true, user, token })
    
    } else {
    
    return res.status(404).send({ success: false, message:
    
    "Please verify your credentials" })
    
    
    
    }
    
    }
    
    } catch (err) {
    return res.status(404).send({ success: false, message: err.message
    
    })
    }
    
    });
    //Access Token
const generateAccessToken=(user) =>{
    return jwt.sign ({ iduser: user._id, role: user.role }, process.env.SECRET, {
    expiresIn: '60s'})
    }
    // Refresh
    function generateRefreshToken(user) {
    return jwt.sign ({ iduser: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y'})
    }
    //Refresh Route
    router.post('/refreshToken', async (req, res, )=> {
    console.log(req.body.refreshToken)
    const refreshtoken = req.body.refreshToken;
    if (!refreshtoken) {
    return res.status(404).send({success: false, message: 'Token Not Found' });
    }
    else {
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) { console.log(err)
    return res.status(406).send({ success: false,message: 'Unauthorized' });
    }
    else {
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log("token-------",token);
    res.status(200).send({success: true,
    token,
    refreshToken
    })
    }
    });
    }
    
    });
module.exports = router;