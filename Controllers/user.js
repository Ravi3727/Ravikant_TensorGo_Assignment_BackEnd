const asyncHandler = require("../Api/asyncHandler.js");
const ApiError = require("../Api/ApiError.js");
const User = require("../Models/user");
const ApiResponse = require("../Api/ApiResponse.js");
const jwt = require("jsonwebtoken");


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        console.log("Generating access and refresh tokens for user:", userId);
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        console.log("User found for token generation:", user);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        console.log("Generated tokens:", { accessToken, refreshToken });

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (e) {
        console.error("Error generating tokens:", e);
        throw new ApiError(500, "Token generation failed");
    }
};


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

    const { fullName, username, password, email, isAdmin,isSuperAdmin } = req.body;
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
        isAdmin: isAdmin,
        isSuperAdmin: isSuperAdmin
    })

    console.log("User Created", user);

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
        const { email, password, username, isSuperAdmin} = req.body;

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
        if(user.isSuperAdmin === false && isSuperAdmin === true){
            throw new ApiError(401, "You are not authorized to login as Super Admin")
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
            expires: new Date(0)
        });

        res.cookie("refreshToken", "", {
            httpOnly: true,
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
    console.log("User is here" + user);
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"))
})