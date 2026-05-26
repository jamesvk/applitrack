const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});
    if (userExists) return res.status(400).json({message: "User already exists!"});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({name, email, password: hashedPassword});

    let accessToken = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "30d"}
    )

    return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken
    })
}

async function loginUser(req, res) {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message: "Invalid Credentials"});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({message: "Invalid Credentials"});

    let accessToken = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "30d"}
    )

    return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken
    })
}

module.exports = {registerUser, loginUser};