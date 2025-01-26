const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function () {
    console.log("ACCESS_TOKEN_SCERET ye raha ",process.env.ACCESS_TOKEN_SCERET)

    // console.log("Loaded Environment Variables:", process.env);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}


module.exports = mongoose.model("User", userSchema);