const asyncHandler = require("../Api/asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        console.log("auth middleware",req.body)
        const {Token1} = req.body;
        const Token = Token1 || req.header("Authorization")?.replace("Bearer", "")
        console.log(Token);
        if (!Token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        //decode necessary info which we sent in user controller jwt token 
        const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SCERET)

        //_id hi kio because jab humne jwt token banaya tha tab yehi name use kiya tha
        //But isme kuch filed mujhe nahi chahiye so i use .select

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        // console.log("User is here" + user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }


        //Abb agar confirm ho agay h ki user aa gaya h to we add a new object to response "res"

        req.user = user;
        next();//next middleware pe chale jao ya aage baad jaoo

    } catch (error) {
        console.log("auth error in : " + error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }


})

module.exports = verifyJWT;