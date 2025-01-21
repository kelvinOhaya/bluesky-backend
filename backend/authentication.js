const express = require('express')
const app = express()
const User = require('./models/userModel')
const http = require('http')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const server = http.createServer(app)
const bcrypt = require('bcryptjs')
const connectDB = require('./db')
connectDB()
require('dotenv').config()



const generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=";
    let result = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }
  


app.use(session({
    secret: process.env.SESSION_SECRET, // Replace with a strong, random secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_CONNECT_URL,
        collectionName: 'sessions'
    }),
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      sameSite: 'strict',// Prevents CSRF attacks,
      originalMaxAge: 20000
    }
  }));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: "GET, POST, PUT, DELETE",
    credentials: true
}))

app.use(express.json())



//signup validation logic
app.post('/userValidation/signup', async (req, res) => {
    //what properties will be valid in the front end
    const isValid = {
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        password: true
    }

    if (req.body.password.length < 8 || !req.body.password.match(/[A-Z]/) || !req.body.password.match(/[!@#$%^&*]/)) {
        isValid.password = false
        
    }

    if (req.body.firstName.match(/[^a-zA-Z]/)) {
        isValid.firstName = false
    }
    if (req.body.lastName.match(/[^a-zA-Z]/)) {
        isValid.lastName = false
    }

    const emailExists = await User.findOne({ email: req.body.email })
    if (emailExists) {
        isValid.email = false
    }

    const userExists = await User.findOne({ username: req.body.username })
    if (userExists) {
        isValid.username = false
    }

    if (!isValid.firstName || !isValid.lastName || !isValid.email || !isValid.username || !isValid.password) {
        return res.status(400).json({message: "some credential is invalid", validation: isValid})
    } else {
        try {   
            const user = new User(req.body)
            await user.save()
            res.status(201).json({success: true, token: generateRandomString(32)})//change

        } catch (error) {
            res.status(400).json({message: error.message})
        }
    }
})

//login validation logic
app.post('/userValidation/login', async (req, res) => {
    try {
        // Find user by username
        const { username } = req.body
        const found = await User.findOne({username: username })
    

        if (!found) {
            // User not found
            return res.status(400).json({ result: false, message: "User doesn't exist" });
        } 

        // Compare passwords
        const { password } = req.body
        const isMatch = await bcrypt.compare(password, found.password);

        console.log(isMatch)


        // Passwords match
        if (isMatch) {
            req.session.user = {username: found.username}
            return res.status(200).json({ success: true, message: 'Login successful'} )
        // Passwords do not match
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ result: false, message: error.message });
    }
});



const PORT = process.env.AUTH_PORT || 4000

server.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})



