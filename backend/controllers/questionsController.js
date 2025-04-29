const questions = require("../database/questions");
// const quiz = require("../database/quiz");

const getQuestions = async (req, res) => {
  try {
    const { section } = req.query;

    const query = section ? { section } : {};
    const quiz_questions = await questions.aggregate([
      { $match: query },
      { $sample: { size: 10 } }, // selecting 10 questions randomly
    ]);

    res.status(200).json(quiz_questions);
  } catch (error) {
    console.log(Error);
    return res.status(500).json({ message: "Error fetching the questions." });
  }
};

module.exports = { getQuestions };
