const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const express = require("express");
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
userRouter.get("/current", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    // res.send(user);
    return res.status(200);
});
//register
userRouter.post("/", async (req, res) => {
    // validate the request body first

    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //find an existing user
    console.log("register");
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user) return res.status(400).send("User already registered.");

    user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({
        _id: user._id,
        name: user.name,
        email: user.email
    });
});
userRouter.post('/login', async(req, res) => {
    //Login a registered user
    try {
        console.log(req.body);
        const { email, password } = req.body;

        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(401).json({ message: 'Auth Failed' });
        }
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id,
                },
                process.env.KEY,
                {
                    expiresIn: '10h',
                }
            );
            return res.status(200).json({ message: 'Auth Successful', token });
        }
        res.status(401).json({ message: 'Auth Failed' });
    } catch (e) {
        throw new Error(e.message);
    }

});

module.exports = userRouter;
