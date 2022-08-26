const owner = require('../models/owner');
const school = require('../models/school');
const teacher = require('../models/teacher');
const leaves = require('../models/leaves');

const getAllLeaves = (req, res) => {
    teacher.findOne({
        teacherId: req.body.teacherId
    }).then((result) => {
        if (result) {
            leaves.find({
                teacherId: result._id
            }).then((result) => {
                if (result) {
                    return res.status(200).send(result);
                } else {
                    return res.status(400).send({
                        msg: 'No leaves found'
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.status(500).send(err);
            });
        } else {
            return res.status(400).send({
                msg: 'No teacher found'
            });
        }
    })
}

const getLeaveCertificate = (req, res) => {
    res.download("./leaveLetters/" + req.body.leaveLetter);
}

module.exports = {
    getAllLeaves,
    getLeaveCertificate
}