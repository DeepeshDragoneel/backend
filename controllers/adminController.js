const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const OTP = require("../models/emailOtp");
const School = require("../models/school.js");
const teacher = require("../models/teacher.js");
const timeline = require("../models/timeline");

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        const school = await School.findOne({ email });
        if (!school) {
            return res.status(202).json({
                success: false,
                message: "School not found",
            });
        }
        if (school.password !== password) {
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
    const token = jwt.sign({ _id: otpData.email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
    });
    return res.status(200).json({
        message: "OTP verified",
        success: true,
        token,
    });
};

const verifyAdmin = async (req, res, next) => {
    try {
        const { token } = req.body;
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const school = await School.findOne({ email: decoded._id });
        // console.log(decoded);
        if (!school) {
            return res.status(200).json({
                message: "school not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "school found",
            success: true,
            school,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error Verifying school",
            success: false,
        });
    }
};

const promoteTeacher = async (req, res) => {
    let teacherRes = teacher.findOne({ teacherId: req.body.teacherId });
    if (teacherRes) {
        let newExactDetails = {
            ...teacherRes.exactDetails,
            position: req.body.position,
            salary: req.body.salary,
        };
        teacherRes.exactDetails = newExactDetails;
        teacherRes.state = req.body.state;
        teacherRes.district = req.body.district;
        teacherRes.school_code = req.body.school_code;
        await timeline.create({
            teacherId: req.body.teacherId,
            Role: req.body.position,
            Type: "Promotion",
            Salary: req.body.salary,
            Date: req.body.DateofPromotion,
            School: req.body.school,
        });
        teacher.updateOne(
            {
                teacherId: req.body.teacherId,
            },
            teacherRes
        );
        res.status(200).json({
            message: "Teacher promoted",
            success: true,
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

const adminSupport = async (req, res, next) => {
    try {
        const { email, subject, description } = req.body;
        // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // const teacher = await Teacher.findOne({ email: decoded._id });
        // if (!teacher) {
        //     return res.status(200).json({
        //         message: "Teacher not found",
        //         success: false,
        //     });
        // }
        const admin = await School.findOne({ email: email });
        // if (!admin) {
        //     return res.status(200).json({
        //         message: "Admin not found",
        //         success: false,
        //     });
        // }
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
            subject: `Query from ${admin.school}`,
            html: `<h1>${subject}</h1><br/><p>${description}</p>`,
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

module.exports = {
    loginController,
    verifyOTP,
    resendOtp,
    verifyAdmin,
    adminSupport,
    verifyTeacher,
    editDetails,
    promoteTeacher,
    verifyAdmin,
};
