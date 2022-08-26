const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
    teacherId: {
        type: String,
        required: true,
    },
    Role: {
        type: String,
        required: true,
    },
    School: {
        type: String,
        required: true,
    },
    Salary: {
        type: String,
        required: true,
    },
    Type:{
        type: String,
        required: true,
    },
    Date:{
        type: String,
        required: true,
    },
    fromSchool:{
        type: String,
    },
});

const timeline = mongoose.model('Timeline', timelineSchema);

module.exports = timeline;
