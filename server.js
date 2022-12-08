// git clone https://github.com/trh4/audi-yes-backend-sendemail.git
const express = require("express");
const validator = require("validator");
const rateLimit = require("express-rate-limit");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 4001;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

const validate = (req, res, next) => {
  if (
    req.query.number &&
    validator.isLength(req.query.number, { min: 0, max: 20 })
  )
    req.validNumber = validator.whitelist(req.query.number, "0123456789");
  else req.validNumber = "";
  if (req.query.name && validator.isLength(req.query.name, { min: 0, max: 30 }))
    req.validName = validator.escape(req.query.name.toLowerCase());
  else req.validName = "";
  next();
};
// my trh577 elastic: 04A7F5BE7D45D074D8C28B759AEC8BFB7180C8542DF07C39E2709C9F011D556BC0CEF7CDD580104B45AEF6C3A8C60BCF
// auri elastic F53392B106F1C07DD0AA642D228CA4EA8A95BFFDF32FD9EE70C0F3E59D52D71F8ED66F8C9BD8675605588FD929C21118
const sendemail = (req, res, next) => {
  if (req.validNumber === "") return next(); // when to skip send?
  const apikey =
    "F53392B106F1C07DD0AA642D228CA4EA8A95BFFDF32FD9EE70C0F3E59D52D71F8ED66F8C9BD8675605588FD929C21118";
  const bodyText = `שם מלא: ${req.validName} \n טלפון : ${req.validNumber} \n רוצה להצטרף `;
  fetch(
    `https://api.elasticemail.com/v2/email/send?` +
      new URLSearchParams({
        apikey: apikey,
        from: "yes@yes-hd.com",
        subject: bodyText,
        to: "trh4445@gmail.com",
        bodyText: bodyText,
        isTransactional: true,
      })
  )
    .then((response) => response.json())
    .then((data) =>
      console.log(data, req.validName, req.validNumber, req.query.number)
    );

  next();
};

app.use("/sendemail", validate, sendemail);

app.get("/sendemail", (req, res, next) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("app listening on port", PORT);
});
