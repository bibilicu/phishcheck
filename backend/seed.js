require("dotenv").config();
const mongoose = require("mongoose");
const quiz = require("./database/quiz");
mongoose.connect(process.env.MONGO_URL);

async function seedDatabase() {
  try {
    const quiz_data = {
      "Introduction to Phishing": [
        {
          text: "Phishing is an act of obtaining the identity of a peer in a fraudulent approach.",
          options: ["True", "False"],
          correct_answer: "True",
          explain_if_correct: "Right on the spot!",
          explain_if_wrong:
            "That is actually true, phishing is actually an act done to steal someone's sensitive data in an illegal approach.",
        },

        {
          text: "Phishing is one of least recurrent cyber attacks, and least threatening.",
          options: ["True", "False"],
          correct_answer: "False",
          explain_if_correct:
            "Right on the spot! It is actually one of most persistent and threatening cyberattacks.",
          explain_if_wrong:
            "This statement is false. Phishing is one of the most recurrent cyberattacks, posing a great threat to cyber security.",
        },

        {
          text: "Social Engineering techniques are not used in phishing attacks.",
          options: ["True", "False"],
          correct_answer: "False",
          explain_if_correct:
            "Exactly! They're actually used, with the scope of manipulating the targets.",
          explain_if_wrong:
            "Not exactly true, these strategies are used to manipulate targets to give out essential credentials to phishers.",
        },

        {
          text: "Email Phishing is the main communication channel between business workers, and the most used mechanism by phishers, sending emails with compromised links and attachments.",
          options: ["True", "False"],
          correct_answer: "True",
          explain_if_correct: "Nice catch!",
          explain_if_wrong:
            "Business workers are actually using email as main communication channel, and phishers take advantage of this mechanism, sending phish emails with links and attachments.",
        },

        {
          text: "You get an email about an alleged job application, which contains a link, with instructions to click on it immediately. You don't think twice and you do as instructed in the email.",
          options: ["True", "False"],
          correct_answer: "False",
          explain_if_correct:
            "Well done, that smells of...a phishing attempt, blended with social engineering tactics.",
          explain_if_wrong:
            "If you ever get a email like this, pressuring you to click on something, disregard it immediately. These are the social engineering mechanism a phisher is using to manipulate you.",
        },

        {
          text: "Smishing stands for SMS messages, and Vishing for voice phishing, which includes phone calls and voice messages.",
          options: ["True", "False"],
          correct_answer: "True",
          explain_if_correct: "Great job, that's the answer!",
          explain_if_wrong:
            "Smishing is a term used to describe phished SMS messages, while Vishing is for suspicious phone calls and voice messages a potential target receives.",
        },

        {
          text: "You have just received an SMS about a package that is on the way, however asked to fill out a form to receive the package. You don't proceed any further and ignore the SMS.",
          options: ["True", "False"],
          correct_answer: "True",
          explain_if_correct: "That's what we call a great approach!",
          explain_if_wrong:
            "This strategy is used by the phisher to pressure you on giving away your credentials, so as a rule of thumb, it's always the best to ignore such messages.",
        },

        {
          text: "When you pick up the call, you get met by a robotic-like voice, saying 'We need to talk, text me.'. You sensed this call being a suspicious one, so you close the call without saying a word.",
          options: ["True", "False"],
          correct_answer: "True",
          explain_if_correct:
            "Great job! This is, yet, another phishing attempt, with social engineering included.",
          explain_if_wrong:
            "If you ever get met by a robotic-like voice, you never proceed to respect the instructions or saying any word, as not only phishers are trying to steal your data, but also your voice to use it for other targets.",
        },

        {
          text: "There are barely any cases of email phishing.",
          options: ["True", "False"],
          correct_answer: "False",
          explain_if_correct:
            "Right on the spot, email phishing is actually one of the most recurrent types of phishing.",
          explain_if_wrong:
            "Being given the email is a primary communication channel, this statement is false. It is also the most used type of phishing.",
        },

        {
          text: "Phishing is a 'piece of cake' to identify.",
          options: ["True", "False"],
          correct_answer: "False",
          explain_if_correct: "That's a great catch, not so easy to depict.",
          explain_if_wrong:
            "Not exactly, it is quite difficult to depict a phishing attempt if not properly educated on this matter.",
        },
      ],

      Email: [
        {
          text: "'Dear Customer, | we've detected unauthorized acceess to your account so it has been set to inactive. To activation your account, please do it as soon as possible to the following link: http://v0ila00-idkk090123.com | Best regards, The Voila Team.'",
          options: ["Legitimate", "Phish"],
          correct_answer: "Phish",
          explain_if_correct:
            "It's a phish! There are grammatical errors to 'access' and 'activation', and the URL's padlock is not secure, and has visible typos.",
          explain_if_wrong:
            "This is actually a phish! There are grammatical errors to 'access', which has an extra e, and 'activation', which is actually 'activate'. Also, the URL's not secure and contains visible typos.",
        },
      ],
    };

    for (const [section_type, questions] of Object.entries(quiz_data)) {
      const quiz_questions = new quiz({
        section_type: section_type,
        questions: questions.map((q) => ({
          ...q,
          image_url: q.image_url || null,
        })),
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
