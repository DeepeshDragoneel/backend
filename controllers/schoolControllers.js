const school = require("../models/school");
const shortid = require('shortid');
const owner = require("../models/owner");
const timeline = require("../models/timeline");
const teacher = require("../models/teacher");

const addSchool = (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const school_docs_file = req.files.school_docs;
    const { username, email, password, school_code, school_name, type_of_school, no_of_posts, no_of_teachers, state,district } = req.body;
    owner.findOne({
        email: req.body.ownerEmail,
        password: req.body.ownerPassword
    }).then((result) => {
        if (result) {
            school.findOne({
                username: username
            }).then((result) => {
                if (result) {
                    return res.status(400).send({
                        msg: 'School already exists'
                    });
                } else {
                    let school_docs_filename = shortid.generate() + ".pdf";
                    school_docs_file.mv("./school_docs/" + school_docs_filename, (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send(err);
                        }
                        const newSchool = new school({
                            username: username,
                            email: email,
                            password: password,
                            school_code: school_code,
                            school_name: school_name,
                            type_of_school: type_of_school,
                            no_of_posts: no_of_posts,
                            no_of_teachers: no_of_teachers,
                            school_docs: school_docs_filename,
                            state:state,
                            district
                        });
                        newSchool.save()
                            .then((result) => {
                                console.log(result);
                                return res.status(200).send({
                                    msg: 'success'
                                });
                            }).catch((err) => {
                                console.log(err);
                                return res.status(500).send(err);
                            });
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.status(500).send(err);
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });
}

const getAllSchools = (req, res) => {
    owner.findOne({
        email: req.body.ownerEmail,
        password: req.body.ownerPassword
    }).then((result) => {
        if (result) {
            school.find()
                .then((result) => {
                    console.log(result);
                    return res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    return res.status(500).send(err);
                });
        } else {
            return res.status(400).send({
                msg: 'fail'
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });
}

const deleteAllSchools = (req, res) => {
    owner.findOne({
        email: req.body.ownerEmail,
        password: req.body.ownerPassword
    }).then((result) => {
        const school_codes = req.body.school_codes;
        console.log(school_codes);
        for (let i = 0; i < school_codes.length; i++) {
            school.findOneAndDelete({
                username: school_codes[i]
            }).then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
                return res.status(500).send(err);
            });
        }
        return res.status(200).send({
            msg: 'success'
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });
}

const editSchool = (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const { username, email, password, school_code, school_name, type_of_school, no_of_posts, no_of_teachers, school_docs,district,state } = req.body;
    owner.findOne({
        email: req.body.ownerEmail,
        password: req.body.ownerPassword
    }).then((result) => {
        if (result) {
            school.updateOne({
                username: username
            },{
                email: email,
                password: password,
                school_code: school_code,
                school_name: school_name,
                type_of_school: type_of_school,
                no_of_posts: no_of_posts,
                no_of_teachers: no_of_teachers,
                username:username,
                state:state,
                district:district
            }).then((result) => {
                if(school_docs!=='null'){
                    const school_docs_file = req.files.school_docs;
                    let school_docs_filename = shortid.generate() + ".pdf";
                    school_docs_file.mv("./school_docs/" + school_docs_filename, (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send(err);
                        }
                        school.updateOne({
                            username: username
                        },{
                            school_docs: school_docs_filename
                        }).then((result) => {
                            console.log(result);
                            return res.status(200).send({
                                msg: 'success'
                            });
                        }).catch((err) => {
                            console.log(err);
                            return res.status(500).send(err);
                        });
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.status(500).send(err);
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });

}

const getSchoolByState = (req, res) => {
    console.log(req.body);
    school.findOne({
        email: req.body.ownerEmail,
        password: req.body.ownerPassword
    }).then((result) => {
        if (result) {
            school.find({
                state: req.body.state,
                district: req.body.district
            })
                .then((result) => {
                    console.log(result);
                    return res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    return res.status(500).send(err);
                });
        } else {
            return res.status(400).send({
                msg: 'fail'
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });
}

const transferTeacher = (req, res) => {
    console.log(req.body);
    school.findOne({
        email: req.body.ownerEmail,
        password: req.body.ownerPassword
    }).then(async (result) => {
        console.log(result);
        console.log(req.body.school_code);
        // console.log()
        if (result) {
            let old_school_code = await teacher.findOne({
                teacherId: req.body.teacherId
            });
            old_school_code = old_school_code.school_code;
            teacher.updateOne({
                teacherId: req.body.teacherId,                
            }, {
                school_code: req.body.school_code
            }).then(async (resultt) => {
                // if(!acknowledged){
                //     return ;
                // }
                let result = await teacher.findOne({
                    teacherId: req.body.teacherId
                });
                let timelineRef = new timeline({
                    teacherId: req.body.teacherId,
                    School: result.school_code,
                    Type: 'transfer',
                    Date: req.body.dateOfTransfer,
                    Salary: JSON.parse(result.extraDetails).salary,
                    Role:JSON.parse(result.extraDetails).position,
                    fromSchool: old_school_code
                });
                await timelineRef.save()
                return res.status(200).send({
                    msg: 'success'
                });
            }).catch((err) => {
                console.log(err);
                return res.status(500).send(err);
            });
        } else {
            return res.status(400).send({
                msg: 'fail'
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });
}

let transferHistory = (req,res) => {
    school.findOne({
        email: req.body.ownerEmail,
        password: req.body.ownerPassword
    }).then((result) => {
        if (result) {
            timeline.find({
            }).then((result) => {
                console.log(result);
                return res.status(200).send(result);
            }).catch((err) => {
                console.log(err);
                return res.status(500).send(err);
            });
        } else {
            return res.status(400).send({
                msg: 'fail'
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });
}


module.exports = {
    addSchool,
    getAllSchools,
    deleteAllSchools,
    editSchool,
    getSchoolByState,
    transferTeacher,
    transferHistory
}