const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
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
            return res.status(400).json({errors: errors.array(), message: "Not valid"})
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
        res.status(500).json({message: 'Something is wrong, try later'})
    }
})
// /api/auth/login
router.post('/login', async (req, res) => {

})

module.exports = router