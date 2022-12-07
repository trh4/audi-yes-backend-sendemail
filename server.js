const express = require("express");
const validator = require("validator");
const rateLimit = require("express-rate-limit");
var nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 4001;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

const validate = (req, res, next) => {
  if (
    req.query.number &&
    validator.isNumeric(req.query.number) &&
    validator.isLength(req.query.number, { min: 0, max: 20 })
  )
    req.validEmail = req.query.number;
  else req.validEmail = "";
  if (req.query.name && validator.isLength(req.query.name, { min: 0, max: 30 }))
    req.validName = req.query.name.toLowerCase();
  else req.validName = "";
  next();
};

const sendemail = (req, res, next) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "youremail@gmail.com",
      pass: "yourpassword",
    },
  });
  var mailOptions = {
    from: "youremail@gmail.com",
    to: "myfriend@yahoo.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  next();
};

app.use("/sendemail", validate, sendemail);

app.get("/sendemail", (req, res, next) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("app listening on port", PORT);
});
