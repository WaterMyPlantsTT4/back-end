const express = require('express');
const cors = require('cors')
const helmet = require('helmet')
const server = express()
const jwt = require('jsonwebtoken')
const KnexSessionStore = require('connect-session-knex')(session)
const userRouter = require('userRouter')
const plantsRouter = require('plantsRouter');
const server = require('..');


//adds auth as middleware to token protected routes
const config = {
    name: 'sessionId',
    secret: 'I solemnly swear I am up to no good',
    cookies: {
        maxAge: 60000 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUnintialized: false,
    store: new KnexSessionStore({
        knex: require('../data/dbConfig'),
        table: 'session',
        sidfieldname: 'sid',
        createTable: true,
        clearInterval: 60000 * 60,
    }),
}


server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session(config))
server.use('api/users', userRouter)
server.use('api/auth', authRouter)
server.use('api/plants', isAuthenticated, plantsRouter)

server.get('/',(req, res) => {
    res.json({ message:'welcome to water my plants!' })
})

function isAuthenticated(req, res, next) {
    const token = req.headers.authorization
    const secret = process.env.JWT_SECRET || 'fubar'
    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: 'access denied'})
            } else {
                req.jwt = decodedToken;
                next();
            }
        })
    } else {
        res.status(401).json({ message: 'missing tokens!'})
    }
}

module.exports = server;