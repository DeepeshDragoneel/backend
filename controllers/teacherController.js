const Teacher = require("../models/teacher");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const OTP = require("../models/emailOtp");
const Training = require("../models/trainings");
const shortid = require("shortid");
const fs = require("fs");
const Leave = require("../models/leaves");
const { Blob } = require("buffer");
const HTMLToPDF = require("html-pdf");
const TeacherFile = require("../models/myFiles");
const path = require("path");
const Admin = require("../models/school");

const pdfTemplate = require("../serviceBookDocs/htmlTemplate");
const owner = require("../models/owner");
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(202).json({
                success: false,
                message: "Teacher not found",
            });
        }
        if (teacher.password !== password) {
            return res.status(202).json({
                message: "Invalid credentials",
            });
        }
        // const token = jwt.sign({ _id: teacher._id }, process.env.JWT_SECRET, {
        //     expiresIn: "1h",
        // });
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true,
            lowerCaseAlphabets: false,
        });

        await OTP.deleteOne({ email: email });

        const emailOtp = new OTP({
            email: email,
            otp: otp,
        });
        await emailOtp.save();

        // console.log(otp);
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "shikshakprabandanorg@gmail.com",
                pass: "ndzjqhmopforejxc",
            },
        });
        let info = await transporter.sendMail({
            from: `"${process.env.GMAIL}"`,
            to: email,
            subject: "SignIn Confirmation",
            text: "Dont share this OTP to anyone!",
            html: `<h2>
                Enter the OPT to verify your account
            </h2>
            <p>
                <b>OTP:</b> ${otp}
            `,
        });
        // console.log("Message sent: %s", info);
        res.status(200).json({
            message: "OTP sent to your email",
            success: true,
            // token,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Logging In",
            success: false,
        });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true,
            lowerCaseAlphabets: false,
        });
        await OTP.deleteOne({ email: email });
        const emailOtp = new OTP({
            email: email,
            otp: otp,
        });
        await emailOtp.save();
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "shikshakprabandanorg@gmail.com",
                pass: "ndzjqhmopforejxc",
            },
        });
        let info = await transporter.sendMail({
            from: `"${process.env.GMAIL}"`,
            to: email,
            subject: "SignIn Confirmation",
            text: "Dont share this OTP to anyone!",
            html: `<h2>
            Enter the OPT to verify your account
        </h2>
        <p>
            <b>OTP:</b> ${otp}
        `,
        });
        // console.log("Message sent: %s", info);
        res.status(200).json({
            message: "OTP sent to your email",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Logging In",
            success: false,
        });
    }
};

const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        console.log(email, otp);
        const otpData = await OTP.findOne({ email: email, otp: otp });
        if (!otpData) {
            return res.status(200).json({
                message: "OTP not found",
                success: false,
            });
        }
        await OTP.deleteOne({ email: email });
        const token = jwt.sign(
            { _id: otpData.email },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h",
            }
        );
        return res.status(200).json({
            message: "OTP verified",
            success: true,
            token,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Logging In",
            success: false,
        });
    }
};

const addTeacher = async (req, res, next) => {
    try {
        const addTeacher = await Teacher.create({
            teacherId: "186433",
            teacherName: "ramakishore",
            teacherSurname: "uppala",
            teacherDOB: "Aug 25 1990",
            teacherGender: "Male",
            fatherName: "Ajay",
            motherName: "Anjali",
            bloodGroup: "O+ve",
            aadharNumer: "500050646084",
            religion: "Hindus",
            address: "Flat no 206 durga vihar apparment",
            city: "pune",
            state: "maharastra",
            country: "india",
            pincode: "111045",
            phoneNumber: "9390571036",
            email: "rareone.kk@gmail.com",
            password: "sih2022",
            gender: "male",
            caste: "OBC",
            profilePicture: "abc.jpg",
            professionalDetails: {
                designation: "Teacher",
                subject: "Maths",
            },
            educationDetails: [
                {
                    nameOfBoard: "Board of Secondary Education",
                    nameOfSchool: "Jevan Shiksha Vidya Mandir",
                    medium: "English",
                    firstLanguage: "Marathi",
                    passed: "1991",
                    marksSecured: "545",
                    maxMarks: "600",
                    hallTicketNumber: "199160701",
                    cerficationNumner: "2345143",
                    certificateLocation: "234",
                    stream: "mpc",
                    branch: "na",
                    subject: "science",
                    methodologySubjct1: "hindi",
                    methodologySubject2: "english",
                },
            ],
            trainings: [
                {
                    startDate: Date.now(),
                    endDate: Date.now(),
                    nameOfTraining: "Computer Training",
                    description: "The training is to educ",
                    proofOfTraining: "abc.txt",
                },
            ],
            reasearch: {
                researchTitle: "Super",
                researchDescription: "adasd",
                researchLocation: "Hyd",
                researchDate: Date.now(),
                researchEndDate: Date.now(),
                ongoing: "false",
                researchProof: "asdasd",
            },
        });
        await addTeacher.save();
        res.status(200).json({
            message: "Teacher Added",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Adding Teacher",
            success: false,
        });
    }
};

const verifyTeacher = async (req, res, next) => {
    try {
        const { token } = req.body;
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        // console.log(decoded);
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Teacher found",
            success: true,
            teacher,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Verifying Teacher",
            success: false,
        });
    }
};

const editDetails = async (req, res, next) => {
    const {
        teacherSurname,
        martialStatus,
        email,
        phoneNumber,
        address,
        token,
    } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        // console.log(teacher);
        // console.log(teacherSurname, martialStatus, email, phoneNumber, address);
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        teacher.teacherSurname = teacherSurname;
        teacher.martialStatus = martialStatus;
        teacher.email = email;
        teacher.phoneNumber = phoneNumber;
        teacher.address = address;
        await teacher.save();
        return res.status(200).json({
            message: "Teacher details updated",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Updating Teacher",
            success: false,
        });
    }
};

const addTraining = async (req, res, next) => {
    const {
        startDate,
        endDate,
        trainingName,
        trainingDescription,
        trainingCertificate,
        token,
    } = req.body;
    console.log(req.body);
    try {
        console.log(
            "asdsa",
            startDate,
            endDate,
            trainingName,
            trainingDescription,
            token
        );
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        // console.log(req.files.trainingCertificate);
        const trainingCertificate = req.files.trainingCertificate;
        // console.log(trainingCertificate);
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        let trainingCertificateFileName = shortid.generate() + ".pdf";
        trainingCertificate.mv(
            "./trainingDocs/" + trainingCertificateFileName,
            (err) => {
                if (err) {
                    console.log(err);
                    return res.status(200).json({
                        message: "Error Uploading File",
                        success: false,
                    });
                }
            }
        );
        console.log(
            startDate,
            endDate,
            trainingName,
            trainingDescription,
            trainingCertificateFileName,
            teacher._id
        );
        const training = await Training.create({
            startDate: startDate,
            endDate: endDate,
            nameOfTraining: trainingName,
            description: trainingDescription,
            proofOfTraining: trainingCertificateFileName,
            teacherId: teacher._id,
        });
        await training.save();
        return res.status(200).json({
            message: "Training Added",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Adding Training",
            success: false,
        });
    }
};

const getTrainings = async (req, res, next) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        const trainings = await Training.find({ teacherId: teacher._id });
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Trainings found",
            success: true,
            trainings,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Getting Trainings",
            success: false,
        });
    }
};

const changePass = async (req, res, next) => {
    const { oldPassword, newPassword, token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        if (teacher.password !== oldPassword) {
            return res.status(200).json({
                message: "Old Password is incorrect",
                success: false,
            });
        }
        teacher.password = newPassword;
        await teacher.save();
        return res.status(200).json({
            message: "Password Changed",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Changing Password",
            success: false,
        });
    }
};

const openPdf = async (req, res, next) => {
    const fileName = req.params.id;
    const pdf = fs.readFileSync("./trainingDocs/" + fileName);
    res.contentType("application/pdf");
    res.send(pdf);
    return;
};

const addLeaves = async (req, res, next) => {
    const { startDate, endDate, numberOfDays, typeOfLeave, desc, token } =
        req.body;
    const leaveLetter = req.files.leaveLetter;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        let leaveLetterFileName = shortid.generate() + ".pdf";
        leaveLetter.mv("./leaveLetters/" + leaveLetterFileName, (err) => {
            if (err) {
                console.log(err);
                return res.status(200).json({
                    message: "Error Uploading File",
                    success: false,
                });
            }
        });
        const leave = await Leave.create({
            teacherId: teacher._id,
            leaveType: typeOfLeave,
            leaveStartDate: startDate,
            leaveEndDate: endDate,
            leaveDescription: desc,
            leaveLetter: leaveLetterFileName,
            numberOfDays: numberOfDays,
        });
        await leave.save();
        return res.status(200).json({
            message: "Leave Added",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Adding Leave",
            success: false,
        });
    }
};

const openLeaveLetter = async (req, res) => {
    try {
        const fileName = req.params.id;
        const pdf = fs.readFileSync("./leaveLetters/" + fileName);
        res.contentType("application/pdf");
        res.send(pdf);
        return;
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Opening Leave Letter",
            success: false,
        });
    }
};

const getAllLeaves = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        const leaves = await Leave.find({ teacherId: teacher._id });
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Leaves found",
            success: true,
            leaves,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Getting Leaves",
            success: false,
        });
    }
};

const generateServiceBook = async (req, res) => {
    const options = JSON.parse(req.query.options);
    const token = req.query.token;
    console.log(options, token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        const profilePictureName = teacher._id + ".png";
        var base64str = base64_encode(
            path.resolve(`./schoolProfilePictures/${profilePictureName}`)
        );
        let educationDetails = false;
        let leaveDetails = undefined;
        let trainingDetails = undefined;
        if (options[0] || options[1]) {
            educationDetails = true;
        }
        if (options[0] || options[3]) {
            leaveDetails = await Leave.find({ teacherId: teacher._id });
            // console.log(leaveDetails);
        }
        if (options[1] || options[5]) {
            trainingDetails = await Training.find({ teacherId: teacher._id });
        }
        await HTMLToPDF.create(
            pdfTemplate(
                base64str,
                teacher,
                educationDetails,
                leaveDetails,
                trainingDetails
            ),
            {}
        ).toFile("serviceBook.pdf", (err, result) => {
            if (err) {
                console.log(err);
                return res.status(200).json({
                    message: "Error Generating Service Book",
                    success: false,
                });
            }
            return res.sendFile(
                path.resolve(__dirname + "/../serviceBook.pdf")
            );
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "Error Generating Service Book",
            success: false,
        });
    }
};

const viewTeacher = (req, res) => {
    owner
        .find({
            email: req.body.ownerEmail,
            password: req.body.ownerPassword,
        })
        .then((response) => {
            Teacher.findOne({ teacherId: req.body.teacherId })
                .then((response) => {
                    console.log(response);
                    return res.status(200).json({
                        message: "Teacher found",
                        success: true,
                        teacher: response,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error finding teacher",
                        success: false,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error finding teacher",
                        success: false,
                    });
                });
        });
};

const viewTeacherV2 = (req, res) => {
    owner
        .find({
            email: req.body.ownerEmail,
            password: req.body.ownerPassword,
        })
        .then((response) => {
            Teacher.find({ state: req.body.state, district: req.body.district })
                .then((response) => {
                    let teachers = [];
                    response.forEach((teacher) => {
                        const extraDetails = JSON.parse(teacher.extraDetails);
                        if (extraDetails.school === req.body.school) {
                            teachers.push({
                                id: extraDetails.teacherId,
                                name: extraDetails.name,
                                dob: teacher.teacherDOB,
                                pos: extraDetails.position,
                                schl: extraDetails.school,
                                tlink: "/view-teacherprofile",
                            });
                        }
                    });
                    return res.status(200).json({
                        message: "Teacher found",
                        success: true,
                        teachers: teachers,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error finding teacher",
                        success: false,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error finding teacher",
                        success: false,
                    });
                });
        });
};

const getTeacher = (req, res) => {
    owner
        .findOne({
            email: req.body.ownerEmail,
            password: req.body.ownerPassword,
        })
        .then((response) => {
            Teacher.findOne({ teacherId: req.body.teacherId })
                .then((response) => {
                    return res.status(200).json({
                        message: "Teacher found",
                        success: true,
                        teacher: response,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error finding teacher",
                        success: false,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error finding teacher",
                        success: false,
                    });
                });
        });
};

const addFiles = async (req, res) => {
    try {
        const { token } = req.body;
        const uploadedFile = req.files.file;
        console.log(req.files);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        let uploadedFileName = shortid.generate() + ".pdf";
        uploadedFile.mv(
            path.resolve("./teacherFileUploads/" + uploadedFile.name),
            async (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error uploading file",
                        success: false,
                    });
                }
                const teacherFile = new TeacherFile({
                    teacherId: teacher._id,
                    fileName: uploadedFile.name,
                    fileSize: uploadedFile.size,
                    upload_date: Date.now(),
                });
                await teacherFile.save();
                return res.status(200).json({
                    message: "File uploaded",
                    success: true,
                });
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error adding files",
            success: false,
        });
    }
};

const getFiles = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        const files = await TeacherFile.find({ teacherId: teacher._id });
        return res.status(200).json({
            message: "Files found",
            success: true,
            files: files,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error getting files",
            success: false,
        });
    }
};

const openTeacherFiles = async (req, res) => {
    try {
        const { fileName } = req.params;
        res.sendFile(path.resolve("./teacherFileUploads/" + fileName));
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            message: "Error getting files",
            success: false,
        });
    }
};

const getAdminUserEmail = async (req, res) => {
    try {
        const { token } = req.query;
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        console.log(teacher.school_code);
        const admin = await Admin.findOne({ school_code: teacher.school_code });
        console.log(admin);
        if (!admin) {
            res.status(200).json({
                message: "Admin not found",
                success: false,
            });
            return;
        }
        res.status(200).json({
            message: "Admin found",
            success: true,
            email: admin.email,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error getting admin",
            success: false,
        });
    }
};

const teachersupport = async (req, res) => {
    try {
        const { email, subject, message, token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        const admin = await Admin.findOne({ school_code: teacher.school_code });
        if (!admin) {
            return res.status(200).json({
                message: "Admin not found",
                success: false,
            });
        }
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "shikshakprabandanorg@gmail.com",
                pass: "ndzjqhmopforejxc",
            },
        });
        let info = await transporter.sendMail({
            from: teacher.email,
            to: email,
            subject: `Query from ${teacher.teacherName}`,
            html: `<h1>${subject}</h1><br/><p>${message}</p>`,
        });
        return res.status(200).json({
            message: "Email sent",
            success: true,
        });
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            message: "Error getting admin",
            success: false,
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const teacher = await Teacher.findOne({ email: email });
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "shikshakprabandanorg@gmail.com",
                pass: "ndzjqhmopforejxc",
            },
        });
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true,
            lowerCaseAlphabets: false,
        });
        await OTP.deleteOne({ email: email });
        const emailOtp = new OTP({
            email: email,
            otp: otp,
        });
        await emailOtp.save();
        let info = await transporter.sendMail({
            from: `"${process.env.GMAIL}"`,
            to: email,
            subject: "Password Reset",
            html: `<h1>Password Reset</h1><br/><p>Enter the OTP to change your password: <b>${otp}</b></p>`,
        });
        console.log(info);
        return res.status(200).json({
            message: "Email sent",
            success: true,
        });
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            message: "Error getting Email",
            success: false,
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const teacher = await Teacher.findOne({ email: email });
        if (!teacher) {
            return res.status(200).json({
                message: "Teacher not found",
                success: false,
            });
        }
        teacher.password = password;
        await teacher.save();
        return res.status(200).json({
            message: "Password changed",
            success: true,
        });
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            message: "Error changing password",
            success: false,
        });
    }
};

const profilePictureUpload = async (req, res) => {
    try {
        const profilePicture = req.files.image;
        // console.log(req);
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        if (!teacher) {
            const school = await Admin.findOne({ email: decoded._id });
            if (!school) {
                return res.status(200).json({
                    message: "Error encountered",
                    success: false,
                });
            } else {
                const profilePictureName = school._id + ".png";
                profilePicture.mv(
                    `./schoolProfilePictures/${profilePictureName}`,
                    (err) => {
                        if (err) {
                            return res.status(200).json({
                                message: "Error uploading profile picture",
                                success: false,
                            });
                        }
                        res.status(200).json({
                            message: "Profile picture uploaded",
                            success: true,
                        });
                        return;
                    }
                );
            }
        } else {
            const profilePictureName = teacher._id + ".png";
            profilePicture.mv(
                `./schoolProfilePictures/${profilePictureName}`,
                (err) => {
                    if (err) {
                        return res.status(200).json({
                            message: "Error uploading profile picture",
                            success: false,
                        });
                    }
                    res.status(200).json({
                        message: "Profile picture uploaded",
                        success: true,
                    });
                    return;
                }
            );
        }
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            message: "Error Whilte uploading profile picture",
            success: false,
        });
    }
};

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString("base64");
}

const getProfilePicture = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const teacher = await Teacher.findOne({ email: decoded._id });
        if (!teacher) {
            res.status(200).json({
                message: "Error getting profile picture",
                success: false,
            });
        }
        const profilePictureName = teacher._id + ".png";
        // const profilePicture = fs.readFileSync(
        //     `./schoolProfilePictures/${profilePictureName}`
        // );
        var base64str = base64_encode(
            path.resolve(`./schoolProfilePictures/${profilePictureName}`)
        );
        res.json({
            success: true,
            image: base64str,
        });
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            message: "Error getting profile picture",
            success: false,
        });
    }
};

module.exports = {
    loginController,
    verifyOTP,
    addTeacher,
    resendOtp,
    verifyTeacher,
    editDetails,
    addTraining,
    getTrainings,
    openPdf,
    changePass,
    addLeaves,
    openLeaveLetter,
    getAllLeaves,
    generateServiceBook,
    viewTeacher,
    viewTeacherV2,
    getTeacher,
    addFiles,
    getFiles,
    openTeacherFiles,
    getAdminUserEmail,
    teachersupport,
    forgotPassword,
    changePassword,
    profilePictureUpload,
    getProfilePicture,
};
