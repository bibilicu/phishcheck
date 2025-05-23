const quiz = require("../database/quiz");
const results = require("../database/results");
// const answer = require("../database/results");
const quiz_attempt = require("../database/quizAttempt");

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

// to measure players' number of attempts
const initializeQuizAttempt = async (req, res) => {
  try {
    const { employee_id, quiz_id } = req.body;

    if (!employee_id || !quiz_id) {
      return res.status(400).json({ Message: "Missing employee or quiz id." });
    }

    const attempt_number =
      (await quiz_attempt.countDocuments({
        employee_id,
        quiz_id,
      })) + 1;

    const new_attempt = await quiz_attempt.create({
      employee_id,
      quiz_id,
      attempt_number,
    });

    res
      .status(201)
      .json({ message: "Quiz started", quiz_attempt_id: new_attempt._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error: ", error });
  }
};

const completeQuizAttempt = async (req, res) => {
  try {
    const { quiz_attempt_id, abandoned = false } = req.body;
    if (!quiz_attempt_id) {
      return res.status(400).json({ message: "Missing quiz attempt." });
    }

    const completed_at = new Date();

    const attempt = await quiz_attempt.findByIdAndUpdate(
      quiz_attempt_id,
      { completed_at, abandoned },
      { new: true }
    );
    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    // auto-flag - if answers are not registered, then flag abandoned as true
    if (
      attempt.correct_count + attempt.wrong_count === 0 ||
      !attempt.completed_at
    ) {
      attempt.abandoned = true;
    } else {
      attempt.abandoned = abandoned;
    }

    attempt.completed_at = completed_at;
    await attempt.save();

    res.json({ message: "Attempt updated: ", attempt });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error: ", error });
  }
};

const saveResults = async (req, res) => {
  try {
    const {
      employee_id,
      quiz_id,
      questions_id,
      selected_answer,
      quiz_attempt_id,
      started_at,
    } = req.body;

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
    if (!quiz_attempt_id) {
      return res.status(400).json({ message: "Attempt number required" });
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

    const answered_at = new Date();
    const started_at_date = new Date(started_at);
    const time_spent = answered_at - started_at_date;

    await results.insertMany({
      employee_id,
      quiz_id,
      quiz_attempt_id,
      questions_id,
      selected_answer,
      is_correct,
      score,
      answered_at,
      started_at: started_at_date,
      time_spent,
    });

    // to partially increment stats
    await quiz_attempt.findByIdAndUpdate(quiz_attempt_id, {
      $inc: {
        total_score: score,
        correct_count: is_correct ? 1 : 0,
        wrong_count: is_correct ? 0 : 1,
      },
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
    // to show the latest attempts score only per quiz
    const attempts = await quiz_attempt
      .find({ employee_id, quiz_id })
      .sort({ completed_at: -1 })
      .lean();
    if (!attempts.length) {
      return res.status(200).json({
        totalScore: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        attempt_number: 0,
        completed_at: null,
      });
    }

    const latest_attempt = attempts[0];

    res.json({
      totalScore: latest_attempt.total_score || 0,
      correctAnswers: latest_attempt.correct_count || 0,
      wrongAnswers: latest_attempt.wrong_count || 0,
      completed_at: latest_attempt.completed_at,
      attempt_number: latest_attempt.attempt_number,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getTotalScore = async (req, res) => {
  const { employee_id } = req.params;

  try {
    const attempts = await quiz_attempt.find({ employee_id });
    if (!attempts.length) {
      return res.status(200).json({
        totalScore: 0,
        correctAnswers: 0,
        totalQuestions: 0,
      });
    }
    const total_score = attempts.reduce(
      (acc, attempt) => acc + (attempt.total_score || 0),
      0
    );
    const correct_answers = attempts.reduce(
      (acc, a) => acc + (a.correct_count || 0),
      0
    );
    const total_questions =
      correct_answers +
      attempts.reduce((acc, a) => acc + (a.wrong_count || 0), 0);

    res.json({ total_score, correct_answers, total_questions });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getQuestions,
  saveResults,
  initializeQuizAttempt,
  getQuizResults,
  getTotalScore,
  completeQuizAttempt,
};
