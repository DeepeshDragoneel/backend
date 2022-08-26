const teachers = require("../models/teacher");
const schools = require("../models/school");
const shortId = require("shortid");
const timeline = require("../models/timeline");

const addTeacher = async (req,res) => {
    const teacherId = (req.body.teacherId)? req.body.teacherId:"NA";
    const teacherName = (req.body.name)? req.body.name:"NA";
    const teacherSurname = (req.body.surname)? req.body.surname:"NA";
    const teacherDOB = (req.body.dob)? req.body.dob:"NA";
    const fatherName = (req.body.fatherName)? req.body.fatherName:"NA";
    const motherName = (req.body.motherName)? req.body.motherName:"NA";
    const bloodGroup = (req.body.bloodGroup)? req.body.bloodGroup:"NA";
    const aadharNumer = (req.body.aadharNumer)? req.body.aadharNumer:"NA";
    const religion = (req.body.religion)? req.body.religion:"NA";
    const address = (req.body.address)? req.body.address:"NA";
    const city = (req.body.city)? req.body.city:"NA";
    const state = (req.body.state)? req.body.state:"NA";
    const country = (req.body.country)? req.body.country:"NA";
    const pincode = (req.body.pincode)? req.body.pincode:"NA";
    const phoneNumber = (req.body.mobile)? req.body.mobile:"NA";
    const email = (req.body.email)? req.body.email:"NA";
    const password = (req.body.password)? req.body.password:"teacher@123";
    const gender = (req.body.gender)? req.body.gender:"NA";
    const caste = (req.body.caste)? req.body.caste:"NA";
    const martialStatus = (req.body.martialStatus)? req.body.martialStatus:"NA";
    let district = (req.body.district)? req.body.district:"NA";
    let ownerEmail = (req.body.ownerEmail)? req.body.ownerEmail:"NA";
    let ownerPassword = (req.body.ownerPassword)? req.body.ownerPassword:"NA";
    const extraDetails = req.body;
    const file_names = [
        "sscCertificate",
        "appointmentLetter",
        "interCertificate", 
        "degreeCertificate",
        "postDegreeCertificate",
        "trainingCertificate",
        "medCertificate",
        "mphilCertificate",
        "casteCertificate"
    ];
    file_names.forEach((file_name) => {
        if(req.files !==null && req.files[file_name]){
            let path = shortId.generate() + ".pdf";
            req.files[file_name].mv(`./certificates/${path}`, (err) => {
                if(err){
                    console.log(err);
                }else{
                    extraDetails[file_name] = path;
                }
            });
        }
    });
    schools.findOne({
        email: ownerEmail,
        password: ownerPassword,
    }).then(school => {
        if(school){
            let school_code = school.school_code;
            const teacher = new teachers({
                teacherId,
                teacherName,
                teacherSurname,
                teacherDOB,
                fatherName,
                motherName,
                bloodGroup,
                aadharNumer,
                religion,
                address,
                city,
                state,
                country,
                pincode,
                phoneNumber,
                email,
                password,
                gender,
                caste,
                martialStatus,
                district,
                school_code,
                extraDetails: JSON.stringify(extraDetails),
            });
            teacher.save(async (err, teacher) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        message: "Internal Server Error",
                        error: err
                    });
                }else{
                    const timelineData = new timeline({
                        teacherId: extraDetails.teacherId,
                        Date: extraDetails.dateOfJoining,
                        School: extraDetails.school,
                        Salary: extraDetails.salary,
                        Type: "Joining",
                        Role: extraDetails.position,
                        fromSchool: extraDetails.school
                    });
                    await timelineData.save();
                    return res.status(200).json({
                        message: "Teacher Added Successfully",
                        teacher
                    });
                }
            });
        } else{
            res.status(400).json({
                message: "Invalid Credentials"
            });
        }      
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    });

}

module.exports = {
    addTeacher
}