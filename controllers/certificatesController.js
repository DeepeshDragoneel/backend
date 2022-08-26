const owner = require('../models/owner');


const downloadCertificate = (req,res) => {
    const {teacherId} = req.body;
    owner.findOne({
        ownerEmail: req.body.ownerEmail,
        ownerPassword: req.body.ownerPassword
    }).then((result) => {
        if (result) {
            console.log(req.body);
            if(req.body.data.certificate)
            res.download("./certificates/"+req.body.data.certificate);
            // return res.status(200).send(result);
        } else {
            return res.status(400).send({
                msg: 'No owner found'
            });
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send(err);
    });
}

module.exports = {
    downloadCertificate
}