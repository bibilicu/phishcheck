import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { Button } from "react-native-paper";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Timer from "./Timer";
import { useNavigation } from "@react-navigation/native";

const Questions = ({ section_type, user }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // 0 - starting from 1
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  // to locally save answers
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [quizId, setQuizId] = useState(null);
  const [quizAttemptId, setQuizAttemptId] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isDisabledNext, setIsDisabledNext] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const timer_interval = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    timer_interval.current?.timer_start();
    return () => timer_interval.current?.timer_stop();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      Animated.timing(progress, {
        toValue: currentIndex + 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentIndex, questions.length]);

  const progressAnimate = progress.interpolate({
    inputRange: [0, questions.length > 0 ? questions.length : 1],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  const renderProgress = () => (
    <View style={styles.progress_bar}>
      <Animated.View
        style={[styles.progress_animate, { width: progressAnimate }]}
      />
    </View>
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const url = `/questions?section_type=${encodeURIComponent(
          section_type
        )}`;
        const { data } = await axios.get(url);
        console.log(data);
        if (data) {
          setQuizId(data.quiz_id);
          setQuestions(data.questions);
          setTotalQuestions(data.questions.length * 10);

          const attempts = await axios.post("/quiz-attempt/start", {
            employee_id: user._id,
            quiz_id: data.quiz_id,
          });

          setQuizAttemptId(attempts.data.quiz_attempt_id);
        }
      } catch (error) {
        console.log(error, {});
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [section_type]);

  const handleAnswer = (answer) => {
    if (!quizId) {
      console.error("Cannot save answer - quizId is missing");
      return;
    }
    const correctAnswer = currentQuestion.correct_answer.toLowerCase();
    const selected = answer.toLowerCase();
    const isCorrect = selected === correctAnswer;
    const answer_time = (Date.now() - startTime) / 1000;

    setSelectedAnswer(answer);
    setIsCorrect(isCorrect);
    setShowExplanation(true);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 10);
    }

    setAnswers((prev) => [
      ...prev,
      {
        questions_id: currentQuestion._id,
        selected_answer: answer,
        is_correct: isCorrect,
        score: isCorrect ? 10 : 0,
        started_at: startTime,
        answered_at: answer_time,
      },
    ]);

    setStartTime(Date.now());
  };

  const handleNext = async () => {
    setIsDisabledNext(true);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
      setIsDisabledNext(false);
    } else {
      const timer_left = timer_interval.current?.get_timer_left();
      const time_spent = 600 - timer_left;

      timer_interval.current?.timer_stop();
      try {
        await Promise.all(
          answers.map((a) =>
            axios.post("/results", {
              employee_id: user._id,
              quiz_id: quizId,
              quiz_attempt_id: quizAttemptId,
              questions_id: a.questions_id,
              selected_answer: a.selected_answer,
              started_at: a.started_at,
              answered_at: a.answered_at,
            })
          )
        );

        await axios.post("/quiz-attempt/complete", {
          quiz_attempt_id: quizAttemptId,
          abandoned: false,
        });
      } catch (error) {
        console.log("Error submitting answers", error);
      }

      navigation.navigate("Result", {
        timer_left,
        time_spent,
        quiz_id: quizId,
      });
    }
  };

  useEffect(() => {
    const handleQuizExit = async () => {
      try {
        if (quizAttemptId) {
          await axios.post("/quiz-attempt/complete", {
            quiz_attempt_id: quizAttemptId,
            abandoned: true,
          });
        }
      } catch (error) {
        console.log("Abandon failed: ", error);
      }
    };

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      handleQuizExit();
    });

    return unsubscribe;
  }, [navigation, quizAttemptId]);

  const handleTimerExpire = async () => {
    await axios.post("/quiz-attempt/complete", {
      quiz_attempt_id: quizAttemptId,
      abandoned: true,
    });
    navigation.navigate("Result", { timer_left: 0, time_spent: 600 });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (!questions.length) return <Text>No questions found</Text>;

  const currentQuestion = questions[currentIndex];

  return (
    <View style={styles.questions}>
      <View>{renderProgress()}</View>
      <Timer ref={timer_interval} onExpire={handleTimerExpire} autoStart />
      <View style={{ position: "relative" }}>
        <Text style={styles.points}>
          {score}/{totalQuestions}
        </Text>
      </View>
      <Text style={styles.title}>Question {currentIndex + 1}</Text>
      <Text style={styles.phraseText}>{currentQuestion.text}</Text>
      {currentQuestion.image && (
        <View>
          <Image
            source={{ uri: `data:image/png;base64, ${currentQuestion.image}` }}
            style={{
              width: "100%",
              height: 245,
              resizeMode: "contain",
              marginTop: 3,
            }}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 12,
              marginTop: 7,
              textAlign: "center",
            }}
          >
            * Do not copy or manually type any present links. For educational
            purposes only.
          </Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        {currentQuestion.options.map((option) => (
          <Button
            key={option}
            style={{ borderRadius: 0, borderColor: "#0F184C", borderWidth: 3 }}
            mode="elevated"
            contentStyle={{
              paddingVertical: 3,
              paddingHorizontal: 8,
              backgroundColor: selectedAnswer
                ? option === selectedAnswer
                  ? isCorrect
                    ? "#3BD24F"
                    : "#B53636"
                  : "#FFF"
                : "#FFF",
            }}
            labelStyle={{ fontSize: 17, color: "#0F184C", fontWeight: "bold" }}
            onPress={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </Button>
        ))}
      </View>
      {showExplanation && (
        <View style={{ marginTop: 15 }}>
          <Text
            style={[
              styles.phrase,
              { color: isCorrect ? "#3BD24F" : "#B53636", fontWeight: "bold" },
            ]}
          >
            {isCorrect
              ? currentQuestion.explain_if_correct
              : currentQuestion.explain_if_wrong}
          </Text>
          <View style={styles.buttonContainerNext}>
            <Button
              disabled={isDisabledNext}
              style={{ borderRadius: 0 }}
              mode="elevated"
              buttonColor="#0F184C"
              contentStyle={{ paddingVertical: 3, paddingHorizontal: 8 }}
              labelStyle={{ fontSize: 17, color: "#FFF" }}
              onPress={handleNext}
            >
              Next
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default Questions;

const styles = StyleSheet.create({
  questions: {
    flex: 1,
    marginTop: 70,
  },

  title: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },

  phrase: {
    textAlign: "center",
    fontSize: 17,
    paddingBottom: 15,
  },

  points: {
    position: "absolute",
    right: 5,
    bottom: 3,
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: "#0F184C",
    width: "25%",
    padding: 9,
    borderWidth: 2,
    color: "#FFF",
    borderColor: "#FFF",
    textAlign: "center",
  },

  phraseText: {
    textAlign: "center",
    fontSize: 17,
    marginVertical: 5,
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: 30,
  },

  buttonContainerNext: {
    alignItems: "center",
    justifyContent: "center",
  },

  progress_bar: {
    width: "100%",
    height: 15,
    top: 65,
    borderRadius: 20,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },

  progress_animate: {
    height: 20,
    bottom: 3,
    backgroundColor: "#0F184C",
    borderRadius: 20,
  },
});
