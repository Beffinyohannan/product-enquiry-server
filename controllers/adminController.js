const createError = require("http-errors");
const jwt = require('jsonwebtoken')
const { genAccessToken, genRefreshToken } = require('../helpers/JWT')
const createHttpError = require('http-errors');
const Enquiry = require("../model/enquiryShema");

let refreshTokenArray = []


const login = async (req, res, next) => {
    const admin={
        _id:process.env.ADMIN_ID,
        email:process.env.ADMIN_EMAIL,
        password:process.env.ADMIN_PASSWORD
    }

    try {
        // console.log(req.body);
        const { email, password } = req.body;

        if(email != admin.email || password != admin.password) throw createError.Unauthorized("Incorrect email or password")


        // generating acess-token and refresh-token
        const accessToken = await genAccessToken(admin)
        const refreshToken = await genRefreshToken(admin)
        // console.log(accessToken);

        // set the refresh-token in to an array
        refreshTokenArray.push(refreshToken)
        // set the access-token to the cookies
        console.log(refreshTokenArray);
        
        res.status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: "strict",
            }).json({ success: true, refreshToken })
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const dashboard =async(req,res,next)=>{
    try {
       const result = await Enquiry.find().sort({date:-1}) 
       res.status(200).json(result)
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const enquiryDelete = async(req,res,next)=>{
    try {
        const id = req.params.id
        console.log(id);
        const result =await Enquiry.deleteOne({_id:id})
        if (result){
            res.status(200).json({success:true})
        } 
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const refreshToken = async(req,res,next)=>{
    console.log(refreshTokenArray,'12345');
    const admin={
        _id:process.env.ADMIN_ID,
        email:process.env.ADMIN_EMAIL,
        password:process.env.ADMIN_PASSWORD
    }

    try {
        const { refToken } = req.body;

         //if there is no ref token throwing err
         if (!refToken)
         throw createHttpError.InternalServerError("no refresh token found");

     //get the ref token from the array with
     if (!refreshTokenArray.includes(refToken)){
        throw createError.Unauthorized("Invalid refresh token")
     } 

     //verify the ref token from array
     jwt.verify(
         refToken,
         process.env.JWT_REFRESH_TOKEN_SECRET,
         async (err, data) => {
             if (err) throw createError.InternalServerError(err);

             //black listing the used refresh token
             refreshTokenArray = refreshTokenArray.filter((item => item != refToken))

             //if it matches create a new pair of auth token and refresh token
             const accessToken = await genAccessToken(admin);
             const refreshToken = await genRefreshToken(admin);

             //saving the new refresh token to array
             refreshTokenArray.push(refreshToken)

             //sending response to the client
             res
                 .status(200)
                 .cookie("accessToken", accessToken, {
                     httpOnly: true,
                     path: "/",
                     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                     sameSite: "strict",
                 })
                 .json({ success: true, message: "new pair of tokens created", refreshToken });
         }
     );

    } catch (error) {
        console.log(error);
        next(error)
    }
}

const logout =(req,res,next)=>{
    try {

        // get the ref token from body
        const { refToken } = req.body;


        //if there is no ref token throwing err
        if (!refToken)
            throw createHttpError.InternalServerError("no refresh token found");

        //get the ref token from the array with
        if (!refreshTokenArray.includes(refToken)) throw createError.Unauthorized("Invalid refresh token")


        //if it matches
        jwt.verify(refToken, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, data) => {
            if (err)throw createError.Unauthorized(
                    "ref token from failed verification"
                );

            //black listing the used refresh token
            refreshTokenArray = refreshTokenArray.filter((item => item != refToken))
                
            res.clearCookie("accessToken").json({ success: true, message: "Logged out successfully" });
        }
        );
    } catch (error) {
        console.log(error);
        next(error)
    }
}


module.exports={
    login,
    dashboard,
    refreshToken,
    logout,
    enquiryDelete
}