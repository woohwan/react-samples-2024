import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { JSONFilePreset } from 'lowdb/node'

const defaultData = { users: []}
const db = await JSONFilePreset('database.json', defaultData)

// Initialize Express app
const app = express()

// Define a JWT secret key, This should be isolated by using env variables for security
const jwtSecurityKey = 'dsfdsfsdfdsvcsvdfgefg'

// Set up CORS and JSON middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Basic home route for the API
app.get('/', (_req, res) => {
    res.send("Auth API.\nPlease use POST /auth & POST /verify for authentication")
})

// The auth endpoint that creates a new user record or logs a user based on an existing record
app.post('/auth', (req, res) => {
    const { email, password } = req.body

    // Look up the user entry in the database
    const user = db
        .get('users')
        .values()
        .filter((user) => email === user.email)

    // If found. compare the hashed passwords and generate the JWT token for the user
    if(user.length == 1) {
        bcrypt.compare(password, user[0].password, function (_err, result) {
            if(!result) {
                return res.status(401).json({message: 'Invalid password'})
            } else {
                let loginData = {
                    email,
                    signInTime: Date.now(),
                }

                const token = jwt.sign(loginData, jwtSecurityKey)
                res.status(200).json({message: 'success', token})
            }
        })

        // If no user is found. hash the given password and create a new entry in the auth db with the email and hashed password
    } else if( user.length === 0 ) {
        bcrypt.hash(password, 10, function(_err, hash) {
            console.log({email, password: hash})
            db.get('users').push({ email, password: hash}).write()

            let loginData = {
                email,
                signInTime: Date.now(),
            }

            const token = jwt.sign(loginData, jwtSecurityKey)
            res.status(200).json({message: 'success', token})
        })
    }
})

// The verify endpoint that check if a given JWT token is valid
app.post('/varify', (req, res) => {
    const tokenHeaderKey = 'jwt-token'
    const authToken = req.headers[tokenHeaderKey]
    try {
        const verified = jwt.verify(authToken, jwtSecurityKey)
        if (verified) {
            return res.status(200).json({status: 'logged in', message: 'success'})
        } else {
            return res.status(401).json({ status: 'invalid auth', message: 'error'})
        }
    } catch (error) {
        // Access Denied
        return res.status(401).json({ status: 'invalid auth', message: 'error'})
    }
})

// An endpoint to see if there's an existing account for a given email address
app.post('/check-account', (req, res) => {
    const { email } = req.body

    console.log(req.body)

    const user = db
        .get('users')
        .value()
        .filter((user) => email === user.email)
    
    console.log(user)

    res.status(200).json({
        status: user.length === 1 ? 'User exists' : 'User does not exist', 
        userExists: user.length === 1,
    })
})

app.listen(3080)
