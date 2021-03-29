const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../users/user_model')
const router = express.Router()

const checkPayload = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        res.status(401).json('illegal payload!')
    } else {
        next()
    }
}

const checkUserNameUnique = async (req, res, next) => {
    try {
        const rows = await User.findBy({username: req.body.username})
        if(!rows.length) {
            next()
        } else {
            res.status(401).json('name already claimed!' )
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

const makeJwt = (user) => {
    const payload = {
        username: user.username,
        id: user.id
    }
    const config = {
        jwtSecret: process.env.JWT_SECRET || 'fubar'
    }
    const option = {
        expiresIn: '1 hour'
    }
    return jwt.sign(payload, config.jwtSecret, option)
}

router.post('/register', checkPayload, checkUserNameUnique, async (req, res) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 6)
        const newUser = await User.insert({username: req.body.username, password: hash, phone_number: req.body.phone_number})
        res.json(newUser)
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

router.post('/login', checkPayload, checkUserNameUnique, (req, res) => {
    try{
        const verifies = bcrypt.compareSync(req.body.password, req.userData.password)
        if (verifies) {
            req.session.user = req.userData
            const token = makeJwt(req.session.user)
            res.json(`Salutations ${req.userData.username}! verifying token ${token}`)
        } else {
            res.status(401).json('no token? no entry!')
        }
    } catch (err) {
        res.status(500).json('it broke!')
    }
})

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err =>{
            if (err) {
                res.json('logout failure!')
            } else res.json('farewell, my friend')
        })
    } else {
        res.json('the session never existed. it is a mystery :o')
    }
})

module.exports = router