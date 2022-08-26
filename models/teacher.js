const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const teacherSchema = new mongoose.Schema({
    teacherId: { type: String, required: true },
    teacherName: {
        type: String,
        required: true,
    },
    teacherSurname: { type: String, required: true },
    teacherDOB: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    aadharNumer: { type: String, required: true },
    religion: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    caste: { type: String, required: true },
    martialStatus: { type: String, required: true },
    district: { type: String, required: true },
    school_code: { type: String, required: true },
    extraDetails:{
        type : String,
        required : true
    },
    createdAt: { type: Date, default: Date.now },
});

const teacher = mongoose.model("teacher", teacherSchema);
module.exports = teacher;