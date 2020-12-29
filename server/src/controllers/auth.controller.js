const authCntrl = {}

const jwt =require('jsonwebtoken')

const User = require('../models/User');
const Role = require('../models/Role');

authCntrl.signup = async (req, res) => {

    const {
        username,
        email,
        password,
        roles
    } = req.body

    const newUser = new User({
        username,
        email,
        password: await User.encryptPassword(password)
    })

    if (roles) {
        const foundRoles = await Role.find({
            name: {
                $in: roles
            }
        })
        newUser.roles = foundRoles.map(role => role._id)
    } else {

        const role = await Role.findOne({
            name: "user"
        })
        newUser.roles = [role._id]
    }

    await newUser.save()

    res.status(200).json({
      message: 'successful signUp'
    })
}

authCntrl.signin = async (req, res) => {

    const userFound = await User.findOne({
        email: req.body.email
    }).populate("roles")

    if (!userFound) {
        return res.status(400).json({
            message: "User Email not Found"
        })
    }

    const matchPassword = await User.comparePassword(req.body.password, userFound.password)

    if (!matchPassword) return res.status(401).json({
        token: null,
        message: 'Invalid password'
    })

    const userId = { id: userFound._id }
    const time = { expiresIn: 86400 }

    const token = jwt.sign(
      userId,
      process.env.SECRET,
      time
    )

    const refreshToken = jwt.sign(
      userId,
      process.env.REFRESH
    )

    res.cookie('accessToken', token, {
      expires: new Date( Date.now() + 43200000 ),
      httpOnly: true,

    })

    res.status(200).json({refreshToken}).end()

}

module.exports = authCntrl