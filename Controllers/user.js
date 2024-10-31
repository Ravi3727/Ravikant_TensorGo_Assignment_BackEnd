const asyncHandler = require("../Api/asyncHandler.js");
const ApiError = require("../Api/ApiError.js");
const User = require("../Models/user");
const ApiResponse = require("../Api/ApiResponse.js");
const jwt = require("jsonwebtoken");


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        console.log("Generating access and refresh tokens", userId);
        const user = await User.findById(userId)
        console.log("Generating access and refresh tokens", user);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        // Abb jab bhi hum save function call krte h ye User models ke sare feilds ko validate krta h but humne to token ke alava kuch nahi bheja to so ve pass a another statement 
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (e) {
        throw new ApiError(500, "Token generation failed")
    }
}

exports.registerUser = asyncHandler(async (req, res) => {
    //Get user Details from frontend
    //Validations
    //Check if user is already exist(By username or email)
    //Chek for avatar
    //Check for images
    //upload them to cloudinary,avatar
    //create user obect then create entry in db
    //remove password and refresh token from response 
    //check for user creation
    //return response 

    const { fullName, username, password, email } = req.body;
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }]
    })

    if (existedUser) {
        throw new ApiError(409, "user email already exists");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username,
        events: [],
        meetings: [],
    })

    const createdUser = await User.findById(user._id).select(
        "-password  -refreshToken "
    )

    if (!createdUser) {
        return res.status(404).json("error", {
            statusCode: 404,
            message: "User not created"
        })
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})


exports.loginUser = asyncHandler(async (req, res) => {
    // req.body -> data
    //username or email
    //password
    //find user in database
    //access and refresh token  
    //send cokkie

    try {
        const { email, password, username } = req.body;

        if (!username && !email) {
            throw new ApiError(400, "Username or Email is required")
        }

        // find user
        const user = await User.findOne({
            $or: [{ email }]
        })



        if (!user) {
            throw new ApiError(400, "User does not exist")
        }

        //"User" mongoDB ka object h or user hamara local object h so we use this because isPasswordCorrect hamne define kiya h or is user ke liye define h iske liye nahi "User"
        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password")
        }

        //Access ans Refresh token kaii baar banae hote h isiliye we make a seperate method fot this 

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        // localStorage.setItem(accessToken, accessToken);
        //send this token to the user through cokkies
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        // req.loggedInUser = loggedInUser._id;
        // console.log("loggedInUser "+ loggedInUser);

        

        const options = {
            httpOnly: true,
            secure: true, // Set to true only in production
            sameSite: 'None',
        };

        // console.log("login se : ",req.cookies);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, {
                loggedInUser,
                accessToken,
                refreshToken
            }, "User logged in successfully"));

    } catch (error) {
        throw new ApiError(401, error?.message || "User does not exist")
    }
})

exports.logoutUser = asyncHandler(async (req, res) => {
    try {
        res.cookie("accessToken", "", {
            httpOnly: true,
            sameSite: 'Lax',
            expires: new Date(0)
        });

        res.cookie("refreshToken", "", {
            httpOnly: true,
            sameSite: 'Lax',
            expires: new Date(0)
        });

        return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to log out user");
    }
});



exports.getUser  = asyncHandler(async (req, res) => {
    const {userId} = req.body;
    const user = await User.findById(userId);
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"))
})

// exports.changeCurrentPassword = asyncHandler(async (req, res) => {
//     const { newPassword, confirmPassword, userId } = req.body;

//     //password change kr raha h => loggedIn h  => auth middleware chala h => to request me user h 
//     if (confirmPassword !== newPassword) {

//         return res.status(404).json(
//             new ApiResponse(404, {}, "Password mismatch")
//         )

//     }

//     const user = await User.findById(userId)

//     //abb User model me mene ispasswordCorrect method banaya tha to we use that vo async tha isiliye await
//     // const isPasswordCorrect = await user.isPasswordCorrect(oldPassword, newPassword)

//     // if (!isPasswordCorrect) {
//     //     throw new ApiError(400, "Old Password incorrect")
//     // }

//     //set new password
//     user.password = newPassword
//     await user.save({ validateBeforeSave: false })

//     return res.status(200).json(new ApiResponse(200, {}, "Password Changed Successfully"))
// })

//Text feilds updation
// exports.updateAccountDetails = asyncHandler(async (req, res) => {

//     //files update ke liye new controller design karo jisee photos change krte vakt faltu me text update na ho
//     const { fullName, email, userId } = req.body

//     if (!fullName || !email) {

//         return res.status(404).json(
//             new ApiResponse(404, {}, "All fields are required")
//         )
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         {
//             $set: {
//                 fullName,
//                 email: email
//             }
//         },
//         { new: true }

//     ).select("-password")

//     return res.status(200).json(new ApiResponse(200, updatedUser, "Account details Updated Successfully"));
// });