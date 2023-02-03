const Enquiry = require("../model/enquiryShema");
const createError = require("http-errors");



const productEnquiry =async(req,res,next)=>{
    console.log(req.body);
    const {name,email,phone,enquiry} = req.body
    try {
        const isExist = await Enquiry.findOne({email:email})
        if(isExist) throw createError.Conflict("Email Already Used Once")
        const newEnquiry = new Enquiry({
            name,
            email,
            phone,
            enquiry,
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