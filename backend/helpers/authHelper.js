const bcrypt = require("bcrypt");
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
} = require("unique-names-generator");
const employee = require("../database/employee");
const nodemailer = require("nodemailer");

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        reject(error);
      }
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          reject(error);
        }
        resolve(hash);
      });
    });
  });
};

const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

const anonymousName = () => {
  return (
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors],
      separator: "",
      style: "capital",
      length: 2,
    }) + Math.floor(10 + Math.random() * 90)
  ); //randomly generating anonymous names
};

// to avoid rare loops of anon names
const anonymousUniqueName = async () => {
  let anonymous_id;
  let existent_id = true;

  while (existent_id) {
    anonymous_id = anonymousName();
    const existing_id = await employee.findOne({ anonymous_id });
    if (existing_id) {
      existent_id = false;
    }

    return anonymous_id;
  }
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.email",
  port: 587,
  secure: false,
  auth: {
    user: "username",
    pass: "password",
  },
});

// emails in the appController
module.exports = {
  hashPassword,
  comparePassword,
  anonymousUniqueName,
  transporter,
};
