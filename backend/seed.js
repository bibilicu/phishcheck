require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const quiz = require("./database/quiz");
mongoose.connect(process.env.MONGO_URL);
const image7 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/url_example.png")
);

const image8 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/url_example_2.png")
);

const image9 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/email_example_6.png")
);

async function seedDatabase() {
  try {
    const quiz_data = {
      Email: [
        {
          text: "You have just received an email with this following link, that seems tricky... | *do not copy or manually type the link(s).* ",
          options: ["Legitimate", "Phish"],
          correct_answer: "Phish",
          explain_if_correct: "Phished link catched!",
          explain_if_wrong:
            "Even if there's safe padlock, this is actually not the legitimate link, but 'https://myaccount.google.com' is",
          image: image8,
        },

        {
          text: "An another email that came with this link, let's check. | *do not copy or manually type the link(s).*",
          options: ["Legitimate", "Phish"],
          correct_answer: "Legitimate",
          explain_if_correct: "Good spotting, no red flags here.",
          explain_if_wrong:
            "That is actually a safe link, a safe padlock and no typos, good to go.",
          image: image7,
        },

        {
          text: "An email from Github about O2Auth just came into your inbox, let's see. | *do not copy or manually type the link(s).*",
          options: ["Legitimate", "Phish"],
          correct_answer: "Legitimate",
          explain_if_correct: "Nice catch, this email is good to go.",
          explain_if_wrong:
            "Legitimate email right here. There are no red flags visible, the sender's domain is not mismatched, and also the links are secured and have no typos.",
          image: image9,
        },
        // {
        //   text: "A suspicious activity? More like a suspicious email...",
        //   options: ["Legitimate", "Phish"],
        //   correct_answer: "Phish",
        //   explain_if_correct: "PhisGotcha!",
        //   explain_if_wrong:
        //     "That is actually a phishing attempt. Typos in the link (v0ila instead of voila), unsecured padlock (http), and 'activation' instead of 'active' are clearly red flags.",
        //   image: image6,
        // },

        // {
        //   text: "Here is a confirmation email about changing your email on a website. This one is tricky.",
        //   options: ["Legitimate", "Phish"],
        //   correct_answer: "Legitimate",
        //   explain_if_correct:
        //     "It's legitimate! Despite the 'immediately' word, there are clearly no red flags and common thing to get confirmation upon email change.",
        //   explain_if_wrong:
        //     "You thought because of 'immediately' word, but here you're safe. If you changed your email, it is normal to get a confirmation for that.",
        //   image: image4,
        // },
      ],
    };

    for (const [section_type, questions] of Object.entries(quiz_data)) {
      const questions_image = questions.map((q) => {
        let image_buffer = null;

        if (q.image) {
          image_buffer = q.image;
        }

        return {
          ...q,
          image: image_buffer || undefined,
        };
      });

      // updating the email quiz
      await quiz.findOneAndUpdate(
        { section_type: section_type },
        {
          $push: {
            questions: {
              $each: questions_image,
            },
          },
        },
        { upsert: true, new: true }
      );
      // const quiz_questions = new quiz({
      //   section_type: section_type,
      //   questions: questions.map((q) => ({
      //     ...q,
      //     image_url: q.image_url || null,
      //   })),
      // });
      // await quiz_questions.save();
      console.log("Database sent successfully!");
    }
    await mongoose.disconnect();
  } catch (error) {
    console.log("Something went wrong: ", error);
    process.exit(1);
  }
}

seedDatabase();
