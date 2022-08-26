module.exports = (
    base64str,
    teacher,
    educationDetails,
    leaveDetails,
    trainingDetails
) => {
    const details = JSON.parse(teacher.extraDetails);
    // console.log(details);
    console.log(trainingDetails);
    return `
        <!document html>
        <html>
            <head>
                <title>${details.name} ${details.teacherSurname}</title>
            </head>
            <style>
                td{border: solid 1px lightgrey;
                    font-size: 10px;
                }
                th{border: solid 1px lightgrey;
                    font-size: 10px;
                    margin: 10px;
                }
            </style>
        </html>
        <body>
            <h1 style="text-align: center">Service Book</h1>
            <img src="data:image/jpeg;base64,${base64str}" style="width: 100px; height: 100px; margin: auto; display: block">
            <h4>Teacher Details:</h4>
            <table
                style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-bottom: 20px;">
                <tr>
                    <td>Teacher Full Name</td>
                    <td>${details.name} ${details.surname}</td>
                </tr>
                <tr>
                    <td>Teacher ID</td>
                    <td>${teacher.teacherId}</td>
                </tr>
                <tr>
                    <td>Teacher Mobile</td>
                    <td>${teacher.phoneNumber}</td>
                </tr>
                <tr>
                    <td>Teacher Email</td>
                    <td>${teacher.email}</td>
                </tr>
                <tr>
                    <td>Teacher Address</td>
                    <td>${teacher.address}</td>
                </tr>
                <tr>
                    <td>Teacher Gender</td>
                    <td>${teacher.gender}</td>
                </tr>
                <tr>
                    <td>Teacher DOB</td>
                    <td>${teacher.teacherDOB}</td>
                </tr>
                <tr>
                    <td>Teacher Fathername</td>
                    <td>${teacher.fatherName}</td>
                </tr>
                <tr>
                    <td>Teacher Mothername</td>
                    <td>${teacher.motherName}</td>
                </tr>
                <tr>
                    <td>Teacher Aadhar</td>
                    <td>${teacher.aadharNumer}</td>
                </tr>
                <tr>
                    <td>Teacher Blood Group</td>
                    <td>${teacher.bloodGroup}</td>
                </tr>
                <tr>
                    <td>Teacher Caste</td>
                    <td>${teacher.caste}</td>
                </tr>
                <tr>
                    <td>Teacher Religion</td>
                    <td>${teacher.religion}</td>
                </tr>
                <tr>
                    <td>Teacher Martial Status</td>
                    <td>${teacher.martialStatus}</td>
                </tr>
                <tr>
                    <td>Teacher District</td>
                    <td>${teacher.district}</td>
                </tr>
                <tr>
                    <td>Teacher School Code</td>
                    <td>${teacher.school_code}</td>
                </tr>
                <tr>
                    <td>Teacher School Name</td>
                    <td>${details.school}</td>
                </tr>
                <tr>
                    <td>Teacher Salary</td>
                    <td>${details.salary}</td>
                </tr>
                <tr>
                    <td>Teacher Position</td>
                    <td>${details.position}</td>
                </tr>
                
            </table>
            ${
                educationDetails
                    ? `<h4>Education Details:</h4>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-bottom: 20px;">
                ${
                    details.degreeCourseTitle !== undefined
                        ? `<th align="center" colspan="3">Degree Course Details:</th>
                        <tr>
                            <td>Degree Course Title</td>
                            <td>${details.degreeCourseTitle}</td>
                        </tr>
                        <tr>
                            <td>Degree Course Institute</td>
                            <td>${details.degreeUniversity}</td>
                        </tr>
                        <tr>
                            <td>Degree Course Year</td>
                            <td>${details.degreePassedMonthYear}</td>
                        </tr>
                        <tr>
                            <td>Degree Course Major Subject</td>
                            <td>${details.degreeCourseSubject}</td>
                        </tr>
                    `
                        : ``
                }
                ${
                    details.postDegreeCourseTitle !== undefined
                        ? `<th align="center" colspan="3">Post Degree Course Details:</th>
                        <tr>
                            <td>Post Degree Course Title</td>
                            <td>${details.postDegreeCourseTitle}</td>
                        </tr>
                        <tr>
                            <td>Post Degree Course Institute</td>
                            <td>${details.postDegreeUniversity}</td>
                        </tr>
                        <tr>
                            <td>Post Degree Course Year</td>
                            <td>${details.postDegreePassedMonthYear}</td>
                        </tr>
                        <tr>
                            <td>Post Degree Course Major Subject</td>
                            <td>${details.postDegreeCourseSubject}</td>
                        </tr>
                    `
                        : ``
                }
                ${
                    details.interCourseTitle !== undefined
                        ? `<th align="center" colspan="3">Post Degree Course Details:</th>
                        <tr>
                            <td>Intermediate Boarding</td>
                            <td>${details.interCourseTitle}</td>
                        </tr>
                        <tr>
                            <td>Intermediate College</td>
                            <td>${details.interCollege}</td>
                        </tr>
                        <tr>
                            <td>Intermediate Course Year</td>
                            <td>${details.interPassedMonthYear}</td>
                        </tr>
                        <tr>
                            <td>Intermediate Subject</td>
                            <td>${details.interCourseSubject}</td>
                        </tr>
                    `
                        : ``
                }
                ${
                    details.sscCourseTitle !== undefined
                        ? `<th align="center" colspan="3">Post Degree Course Details:</th>
                        <tr>
                            <td>Schooling Board</td>
                            <td>${details.sscCourseTitle}</td>
                        </tr>
                        <tr>
                            <td>School</td>
                            <td>${details.sscSchoolName}</td>
                        </tr>
                        <tr>
                            <td>Schooling Course Year</td>
                            <td>${details.sscPassedMonthYear}</td>
                        </tr>
                        <tr>
                            <td>Schooling Subject</td>
                            <td>${details.sscCourseSubject}</td>
                        </tr>
                    `
                        : ``
                }
            </table>
            `
                    : ""
            }
            ${
                leaveDetails !== {} &&
                leaveDetails !== undefined &&
                leaveDetails !== null
                    ? `<h4>Leave Details:</h4>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-bottom: 20px;">
                <th>
                    <td>Leave Type</td>
                    <td>Leave Reason</td>
                    <td>Leave Start Date</td>
                    <td>Leave End Date</td>
                    <td>Number of days</td>
                </th>
                ${leaveDetails
                    .map((leave, idx) => {
                        return `<tr>
                            <td>${idx + 1}</td>
                            <td>${leave.leaveType}</td>
                            <td>${leave.leaveDescription}</td>
                            <td>${new Date(
                                leave.leaveStartDate
                            ).toDateString()}</td>
                            <td>${new Date(
                                leave.leaveEndDate
                            ).toDateString()}</td>
                            <td>${leave.numberOfDays}</td>
                        </tr>`;
                    })
                    .join("")}
                    `
                    : ""
            }
            ${
                trainingDetails !== {} &&
                trainingDetails !== undefined &&
                trainingDetails !== null
                    ? `<h4>Training Details:</h4>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-bottom: 20px;">
                <th>
                    <td>Name of Training</td>
                    <td>Description</td>
                    <td>Start Date</td>
                    <td>End Date</td>
                </th>
                ${trainingDetails
                    .map((training, idx) => {
                        return `<tr>
                            <td>${idx + 1}</td>
                            <td>${training.nameOfTraining}</td>
                            <td>${training.description}</td>
                            <td>${new Date(
                                training.startDate
                            ).toDateString()}</td>
                            <td>${new Date(
                                training.endDate
                            ).toDateString()}</td>
                        </tr>`;
                    })
                    .join("")}
                    `
                    : ""
            }
        </body>
    `;
};
