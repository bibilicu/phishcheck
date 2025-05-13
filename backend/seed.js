require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const quiz = require("./database/quiz");
mongoose.connect(process.env.MONGO_URL);
const image1 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/smishing_1.png")
);

const image2 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/smishing_2.jpg")
);

const image3 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/smishing_3.jpg")
);

const image4 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/smishing_4.jpg")
);

const image5 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/smishing_5.jpg")
);

const image6 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/smishing_6.jpg")
);

const image7 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/smishing_7.jpg")
);

const image8 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/smishing_8.jpg")
);

const image9 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/smishing_9.jpg")
);

const image10 = fs.readFileSync(
  path.join(__dirname, "../frontend/assets/smishing_example_10.jpg")
);

async function seedDatabase() {
  try {
    const quiz_data = {
      Smishing: [
        {
          text: "'Beware, your account has been set to Inactive, so you will not be able to use it. Reactivate now.', could be legitimate, could be not?",
          options: ["Legitimate", "Phish"],
          correct_answer: "Phish",
          explain_if_correct:
            "Right on the spot! Despite the url looking safe, the grammatical error and the sense of urgency give it away.",
          explain_if_wrong:
            "Here we deal with grammar mispelling - 'Inactive, not 'inactive', the sense of urgency - 'reactivate now', and the dodgy domain - this SMS is clearly a phish.",
          image: image1,
        },

        {
          text: "You get a SMS from PostNord saying 'Your order is ready for pick up, follow the steps to receive it.' Seems tricky.",
          options: ["Legitimate", "Phish"],
          correct_answer: "Phish",
          explain_if_correct:
            "That is a phish! The message here is in Danish, however the phone code and the phished link gives the suspicions away.",
          explain_if_wrong:
            "You've just got phished! The SMS is in danish, but the phone number starts with +48, and the phone code for Denmark is +45. Also the link seems more likely to redirect you somewhere else.",
          image: image2,
        },

        {
          text: "You get this following SMS about your parking account being temporarily due to absent payment, what do you think it is? ",
          options: ["Legitimate", "Phish"],
          correct_answer: "Legitimate",
          explain_if_correct:
            "This one is safe, it is normal to have your account paused if the payment is missing.",
          explain_if_wrong:
            "Not a phish here, if the payment is missing, it's normal to being notified about your account being paused due to missing payment. No sense of urgency here either.",
          image: image3,
        },

        {
          text: "'Congratulations! You have won a free board with buckets and shots to the weekend. Come at least 4 people.' that sounds tempting...",
          options: ["Legitimate", "Phish"],
          correct_answer: "Legitimate",
          explain_if_correct:
            "That is a legitimate one. There's a condition set to claim this prize.",
          explain_if_wrong:
            "Worry not, it's not a phish. There's a condition if you want to claim this prize so it's nothing you can claim this by magic.",
          image: image4,
        },

        {
          text: "'TheYouBoys looking for job in the oven?' that's suspicious...",
          options: ["Legitimate", "Phish"],
          correct_answer: "Phish",
          explain_if_correct:
            "Exactly, that's a phish. Grammar mistakes and the random VAN number give it away.",
          explain_if_wrong:
            "That is actually a phishing attempt, where phishers try to trick you with this scenario of them looking for a job. Grammar mistakes and a random number are huge red flags here.",
          image: image5,
        },

        {
          text: "'Your package has arrived, but it requires processing of customs duties, fill out the form here.', alright, an another package I haven't ordered...",
          options: ["Legitimate", "Phish"],
          correct_answer: "Phish",
          explain_if_correct: "That is a phish SMS, right here!",
          explain_if_wrong:
            "It's unusual to be asked for personal information in order to receive a package you never ordered, and these 'custom duties' are actually the phishers' trying to steal your credentials.",
          image: image6,
        },

        {
          text: "A SMS about a job application update, let's check it out, and maybe the email eventually. Is it legitimate or not?",
          options: ["Legitimate", "Phish"],
          correct_answer: "Legitimate",
          explain_if_correct:
            "That's a legitimate one, if you applied for the job.",
          explain_if_wrong:
            "This one is safe, it's just an update about the interview call to your job application, therefore they kindly ask you to check the email for further information.",
          image: image7,
        },

        {
          text: "'The debt agency has sent you a Digital Post, log in here', a SMS from debt agency, weird...could be true, could be not?",
          options: ["Legitimate", "Phish"],
          correct_answer: "Phish",
          explain_if_correct:
            "A phish SMS has been catched! The phisher pretends to be someone from the Debt Agency, texting you with a fake replica of authentication page.",
          explain_if_wrong:
            "That's actually a trap set by the phisher pretending to be someone from Debt Agency, and the link also takes you to a fake authentication code, the link not having a padlock, but a .com domain.",
          image: image8,
        },

        {
          text: "'You have received a new post from IDA. You can read your post by logging in to *provided link*. At the bottom of the page you can access the case number.', let's check out the link and the SMS...",
          options: ["Legitimate", "Phish"],
          correct_answer: "Legitimate",
          explain_if_correct:
            "This one is legitimate, where your union let you know a post has been sent to your account, the padlock is there and the link is the real one.",
          explain_if_wrong:
            "Not a phish here. The link has secure padlock, and it actually goes to the union's login page to access the dashboard. No red flags here.",
          image: image9,
        },

        {
          text: "'We have received your shipment, but the custom duties are being charged. Please fill out the form.', an another shipment and must fill out something, something's off...",
          options: ["Legitimate", "Phish"],
          correct_answer: "Phish",
          explain_if_correct:
            "Exactly, a potential phish right here. Despite the link's safe padlock, social engineering tactics are heavily present here.",
          explain_if_wrong:
            "Even if the link provided looks legitimate and has safe padlock, this is still a phish. You're never asked to fill out forms to receive your order, especially if you didn't order anything.",
          image: image10,
        },
      ],
    };

    for (const [section_type, questions] of Object.entries(quiz_data)) {
      const question = questions.map((q) => {
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
      // await quiz.findOneAndUpdate(
      //   { section_type: section_type },
      //   {
      //     $push: {
      //       questions: {
      //         $each: questions,
      //       },
      //     },
      //   },
      //   { upsert: true, new: true }
      // );
      const quiz_questions = new quiz({
        section_type: section_type,
        questions: question,
      });
      await quiz_questions.save();
      console.log("Database sent successfully!");
    }
    await mongoose.disconnect();
  } catch (error) {
    console.log("Something went wrong: ", error);
    process.exit(1);
  }
}

seedDatabase();
