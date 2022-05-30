const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Unexpected email').isEmail(),
        check('password', 'Min length of password is 6').isLength({min:6})
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json(
                {
                    errors: errors.array(),
                    message: "Not valid credentials"
                }
            )
        }

        const {email, password} = req.body;

        const candidate = await User.findOne({email})

        if (candidate) {
            res.status(400).json({message: "User already exists."})
        }

        const hashedPassword = await bcrypt.hash(password, 13)

        const user = new User({email, password: hashedPassword})

        await user.save()

        res.status(200).json({message: "Success"})
    } catch (e) {
        res.status(500).json({message: 'Something is wrong, try again'})
    }
})
// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Enter correct login').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json(
                {
                    errors: errors.array(),
                    message: "Not valid credentials while log in."
                }
            )
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: 'User does not exists'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: 'Wrong password!'})
        }

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )

        res.json({token, useId: user.id})
    } catch (e) {
        res.status(500).json({message: 'Something is wrong, try again'})
    }
})

module.exports = router