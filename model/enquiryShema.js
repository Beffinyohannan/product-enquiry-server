const mongoose = require('mongoose')

const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const enquirySchema =mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        validate: [validateEmail, 'Please fill a valid email address'],
        required: [true, "Email is required"],
        unique: true
    },
    phone: {
        type: Number,
        minlength: [10, "phone number must be 10 digits"],
        required: [true, "Phone number is required"]
    },
    enquiry:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const Enquiry = mongoose.model('Enquiry',enquirySchema)
module.exports = Enquiry