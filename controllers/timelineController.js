const owner = require('../models/owner');
const school = require('../models/school');
const teacher = require('../models/teacher');
const timelines = require('../models/timeline');

const getTimelines = (req, res) => {
    timelines.find({
        teacherId:req.body.teacherId
    }).then((result) => {
        if (result) {
            return res.status(200).send(result);
        } else {
            return res.status(400).send({
                msg: 'No timelines found'
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });
}

module.exports = {
    getTimelines
}