
let tempEmail = "";
let tempPassword = "";
let otp = 3;
let finduser = { email: "", pass: "", uname: "", comnt: "" };
app.post('/signup', (req, res) => {
let userMail = req.body.email;
let userPassword = req.body.password;
User.findOne({ Email: userMail }, (err, finduser) => {
if (finduser) {
setTimeout(() => {
res.redirect('/feedback');
}, 2000);
}
else {
tempEmail = userMail;
tempPassword = userPassword;
otp = Number.parseInt(Math.random() * 1000000);//random otp generator
let mailDetails = {
from: '21cse307.roshankumarnayak@giet.edu',
to: tempEmail,
subject: 'Test mail',
text: `Node.js testing mail for GeeksforGeeks ${otp}`
};

mailTransporter.sendMail(mailDetails, (err) => {
if (err) {
console.log(`error at mail detail is : ${err}`);
} else {
console.log('Email sent successfully');
}
});
res.render('otpvarification');
}
})
});
app.post('/otpvarification', (req, res) => {
console.log(otp);
if (otp == req.body.otp) {
console.log('otp matched');
const newUser = new User({
Email: tempEmail,
Password: tempPassword
});
newUser.save((err) => {
if (err)
console.log(err);
else
res.status(200).render('mainfeedback');
});
}
})
app.post('/feedback', (req, res) => {

let userMail = req.body.email;
let userPassword = req.body.password;
if (userPassword === null) {
console.log("null got");
}
console.log(userMail, "\t", userPassword);
User.findOne({ Email: userMail }, (err, finduser) => {
console.log(finduser);
if (finduser) {
if (finduser.Password === userPassword) {
tempEmail = userMail;
res.redirect('/mainfeedback')
}
}
else {
res.render('signup');
}
});
});
app.post('/mainfeedback', (req, res) => {
const username = req.body.name;
const userComment = req.body.feedback;
User.updateOne({ Email: tempEmail }, { userName: username, comment: userComment }, (err) => {
if (!err) {
res.redirect('/');
}
else {
console.log(err);
}
});
});
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: '21cse307.roshankumarnayak@giet.edu',
    pass: 'roshan@123'
    }
    });
