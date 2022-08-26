const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    nameOfTraining: {
        type: String,
    },
    description: {
        type: String,
    },
    proofOfTraining: {
        type: String,
    },
});

const training = mongoose.model("training", trainingSchema);
module.exports = training;
