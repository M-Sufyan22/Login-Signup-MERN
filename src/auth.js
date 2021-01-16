const jwt = require('jsonwebtoken');
const User = require('../model/users');

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        var verifiedUser = jwt.verify(token, process.env.SECRET_KEY);

        const currentUser = await User.findOne({ _id: verifiedUser._id });
        req.token = token;
        req.user = currentUser;

        next();
    } catch (err) {
        res.status(400).send(err)
    }
};

module.exports = auth;