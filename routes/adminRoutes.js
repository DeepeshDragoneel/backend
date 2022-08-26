const express = require("express");

const router = new express.Router();

const adminController = require("../controllers/adminController");

const teacherCrudController = require("../controllers/teacherCrudController");

const getTimelines = require("../controllers/timelineController");

const certficates = require("../controllers/certificatesController");

const leavesController = require("../controllers/leavesController");

const schoolController = require("../controllers/schoolControllers");

router.post("/adminLogin", adminController.loginController);
router.post("/verifyOTP", adminController.verifyOTP);
router.post("/resendOtp", adminController.resendOtp);
router.post("/verifyAdmin", adminController.verifyAdmin);
router.post("/admin/addTeacher", teacherCrudController.addTeacher);
router.post("/getTimelines", getTimelines.getTimelines);
router.post("/downloadCertificate", certficates.downloadCertificate);
router.post("/getAllLeaves", leavesController.getAllLeaves);
router.post("/getLeaveCertificate", leavesController.getLeaveCertificate);
// router.post("/adminSupport", leavesController.adminSupport);
router.post("/getSchoolByState", schoolController.getSchoolByState);
router.post("/transferTeacher", schoolController.transferTeacher);
router.post("/transferHistory", schoolController.transferHistory);
router.post("/promoteTeacher", adminController.promoteTeacher);

module.exports = router;
