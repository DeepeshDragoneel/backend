const mongoose = require("mongoose");

const emailOtop = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        expires: 300,
    },
});

const EmailOtp = mongoose.model("emailOtp", emailOtop);
module.exports = EmailOtp;