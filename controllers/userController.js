const Enquiry = require("../model/enquiryShema");
const createError = require("http-errors");
const axios = require('axios')



const productEnquiry =async(req,res,next)=>{
    // console.log(req.body.currentLocation);
    // const location =await axios.get('https://ipapi.co/json')
    // console.log(location.data,'qwerty');
    try {
        const {name,email,phone,enquiry} = req.body.enquiryData
        const {ip,city,country_name} = req.body.currentLocation
        const isExist = await Enquiry.findOne({email:email})
        if(isExist) throw createError.Conflict("Email Already Used Once")
        const newEnquiry = new Enquiry({
            name,
            email,
            phone,
            enquiry,
            ip,
            city,
            country_name
        })
        const result = await newEnquiry.save()
        res.status(200).json({success:true,result})
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports={
    productEnquiry
}