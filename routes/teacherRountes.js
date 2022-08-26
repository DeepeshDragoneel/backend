const express = require("express");

const router = new express.Router();

const teacherController = require("../controllers/teacherController");
router.post("/teacherLogin", teacherController.loginController);
router.post("/addTeacher", teacherController.addTeacher);
router.post("/verifyOTP", teacherController.verifyOTP);
router.post("/resendOtp", teacherController.resendOtp);
router.post("/verifyTeacher", teacherController.verifyTeacher);
router.post("/editDetails", teacherController.editDetails);
router.post("/addTraining", teacherController.addTraining);
router.post("/changePass", teacherController.changePass);
router.post("/addLeaves", teacherController.addLeaves);
router.post("/addFiles", teacherController.addFiles);
router.post("/teachersupport", teacherController.teachersupport);
router.post("/forgotPassword", teacherController.forgotPassword);
router.get("/generateServiceBook", teacherController.generateServiceBook);
router.get("/getTrainings", teacherController.getTrainings);
router.get("/getAllLeaves", teacherController.getAllLeaves);
router.get("/openPdf/:id", teacherController.openPdf);
router.get("/openLeaveLetter/:id", teacherController.openLeaveLetter);
router.get("/openTeacherFiles/:fileName", teacherController.openTeacherFiles);
router.get("/getAdminUserEmail", teacherController.getAdminUserEmail);
router.post("/viewTeacher", teacherController.viewTeacher);
router.post("/changePassword", teacherController.changePassword);
router.get("/getFiles", teacherController.getFiles);
router.post("/viewTeacherV2", teacherController.viewTeacherV2);
router.post("/profilePictureUpload", teacherController.profilePictureUpload);
router.post("/getTeacher", teacherController.getTeacher);
router.get("/getProfilePicture", teacherController.getProfilePicture);
module.exports = router;
