require("dotenv").config();
const mongoose = require("mongoose");
const Questions = require("./database/questions");
mongoose.connect(process.env.MONGO_URL);

async function seedDatabase() {
  try {
    await Questions.insertMany([
      {
        section: "Introduction to Phishing",
        text: "Bait, Hook and Catch are the three steps of a phishing attack, with the first one targeting the person to steal the data from, then manipulating the person, and lastly, to successfully steal the person's data and use it for other targets.",
        options: ["True", "False"],
        correct_answer: "True",
        explain_if_correct:
          "Good job! Bait, Hook and Catch are actually the three steps of phishing attacks, good catch.",
        explain_if_wrong:
          "Not actually false. Bait is when the phisher targets the person they want to steal the identity by sending too-good-to-be-true made-up stories, Hook is when the target is being manipulated, and the last one is the target giving out the credentials to the phisher.",
      },
      {
        section: "Introduction to Phishing",
        text: "Emails containing links are all the time attempts of phishers to steal your identity.",
        options: ["True", "False"],
        correct_answer: "False",
        explain_if_correct:
          "Exactly, emails that contain links are not, all the time, phished emails. Let's say you get an email with a link if you've just signed up and you're required to verify your account.",
        explain_if_wrong:
          "Not exactly all the time. As example, if you've just created an account and have to verify your account, then an email with a verification link will come up.",
      },
      {
        section: "Introduction to Phishing",
        text: "Let's say a colleague of yours is asking for your credentials for some top client of the company, mentioning that it is urgent and has to be sent as soon as possible, so you do as instructed.",
        options: ["True", "False"],
        correct_answer: "False",
        explain_if_correct:
          "Good catch! What you are dealing here with is a sense of urgency the phisher is trying to pose, in hopes you will be manipulated.",
        explain_if_wrong:
          "You've just became a victim to phishing! Actually not, but this is what would've happened if you proceeded further, because the phisher posed a sense of urgency, with the goal of manipulating you.",
      },
      {
        section: "Introduction to Phishing",
        text: "You receive a phone call from your mother that she was involved in an accident, asking for a great amount of money for financial aid. You close this call, and call your 'real' mother, asking if she was, indeed, involved in an accident.",
        options: ["True", "False"],
        correct_answer: "True",
        explain_if_correct:
          "Good job! That's a rule of thumb to call your dear ones to double check, that's an attempt of the phishers to pretend they're someone and manipulate you into sending your sensitive data.",
        explain_if_wrong:
          "Whoopsie, just fell into the trap of phishing. Not the case now, so worry not, but the rule of thumb is to close that call without providing further information, and call your dear ones for double check.",
      },
      {
        section: "Introduction to Phishing",
        text: "You have received a link through an SMS, saying that your account has been set inactive, and to access the link to set it back to active. However you don't remember having an account to the supposed website, so you just ignore the SMS.",
        options: ["True", "False"],
        correct_answer: "True",
        explain_if_correct:
          "Good job! This is, yet, an another attempt of the phisher to get their hands on your data.",
        explain_if_wrong:
          "Not exactly, this is an another attempt of the phisher of steal your data, so the best you can do here is, simply ignore the SMS and to not proceed further.",
      },
    ]);

    console.log("Database sent successfully!");
    await mongoose.disconnect();
  } catch (error) {
    console.log("Something went wrong: ", error);
    process.exit(1);
  }
}

seedDatabase();
