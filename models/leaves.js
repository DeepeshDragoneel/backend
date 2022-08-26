const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
        required: true,
    },
    leaveType: {
        type: String,
        required: true,
    },
    leaveDescription: {
        type: String,
        required: true,
    },
    leaveLetter: {
        type: String,
        required: true,
    },
    leaveStartDate: {
        type: Date,
        required: true,
    },
    leaveEndDate: {
        type: Date,
        required: true,
    },
    numberOfDays: {
        type: Number,
        required: true,
    },
});

const leave = mongoose.model("leave", leaveSchema);
module.exports = leave;