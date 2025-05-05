const quiz = require("../database/quiz");
const results = require("../database/results");
const answer = require("../database/results");
const { ObjectId } = require("mongodb");

const getQuestions = async (req, res) => {
  try {
    const { section_type } = req.query;

    if (!section_type) {
      return res.status(400).json({ message: "Section required." });
    }

    const quiz_section = await quiz
      .findOne({ section_type })
      .select("_id section_type questions")
      .lean(); // convert to plain JS

    if (!quiz_section) {
      return res
        .status(400)
        .json({ message: "Couldn't find quiz for this section." });
    }

    // randomizing questions
    const random_questions = quiz_section.questions
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    res.status(200).json({
      quiz_id: quiz_section._id,
      section_type: quiz_section.section_type,
      questions: random_questions,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching the questions." });
  }
};

const saveResults = async (req, res) => {
  try {
    const { employee_id, quiz_id, questions_id, selected_answer } = req.body;

    if (!employee_id) {
      return res.status(400).json({ message: "Employee Required." });
    }
    if (!quiz_id) {
      return res.status(400).json({ message: "Quiz Required." });
    }
    if (!questions_id) {
      return res.status(400).json({ message: "Question Required." });
    }
    if (!selected_answer) {
      return res.status(400).json({ message: "Selected answer Required." });
    }

    const quiz_questions = await quiz.findOne({
      _id: quiz_id,
      "questions._id": questions_id,
    });

    if (!quiz_questions) {
      return res.status(404).json({ message: "Couldn't find the question." });
    }

    // checking if the selected answer matches with the correct answer from Questions model
    const found_question = quiz_questions.questions.find((q) =>
      q._id.equals(questions_id)
    );
    if (!found_question) {
      return res.status(404).json({
        message: "Question not found in the quiz",
      });
    }

    // scoring system
    const is_correct = selected_answer === found_question.correct_answer;
    const score = is_correct ? 10 : 0;

    await answer.insertMany({
      employee_id,
      quiz_id,
      questions_id,
      selected_answer,
      is_correct,
      score,
      answered_at: new Date(),
    });

    res.status(201).json({ message: "Answer saved successfully", is_correct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error saving the results." });
  }
};

const getQuizResults = async (req, res) => {
  const { employee_id, quiz_id } = req.params;

  try {
    const result = await results.aggregate([
      {
        $match: {
          employee_id: new ObjectId(employee_id),
          quiz_id: new ObjectId(quiz_id),
        },
      },
      {
        $group: {
          _id: "$quiz_id",
          totalScore: { $sum: "$score" },
          correctAnswers: {
            $sum: { $cond: ["$is_correct", 1, 0] },
          },
          totalQuestions: { $sum: 1 },
        },
      },
    ]);
    if (result.length === 0) {
      return res.status(400).json({ message: "No results found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getTotalScore = async (req, res) => {
  const { employee_id } = req.params;

  try {
    const result = await results.aggregate([
      { $match: { employee_id: new ObjectId(employee_id) } },
      {
        $group: {
          _id: "$employee_id",
          totalScore: { $sum: "$score" },
          correctAnswers: {
            $sum: { $cond: ["$is_correct", 1, 0] },
          },
          totalQuestions: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(400).json({ message: "No results found." });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
module.exports = { getQuestions, saveResults, getQuizResults, getTotalScore };
