const mongoose = require("mongoose");

const myFilesSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileSize: {
        type: String,
        required: true,
    },
    upload_date: {
        type: Date,
        required: true,
    },
});

const myFiles = mongoose.model("myFiles", myFilesSchema);
module.exports = myFiles;
