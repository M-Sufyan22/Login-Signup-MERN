const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        minlength: 3,
    },
    lname: {
        type: String,
        required: true,
        minlength: 3,
    },
    uname: {
        type: String,
        required: true,
        minlength: 3,
        unique: [true, 'this username is already exist']
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email id already exist'],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid');
            }
        }
    },
    phone: {
        type: Number,
        minlength: 10,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

});


usersSchema.methods.getAuthToken = async function() {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, {
            expiresIn: '5 minutes'
        });
        this.tokens = await this.tokens.concat({ token: token });
        await this.save();
        return token
    } catch (err) {
        console.log(err);
    }
};

//  middleware for bcrypt password
usersSchema.pre("save", async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});



const User = new mongoose.model('User', usersSchema);

module.exports = User;