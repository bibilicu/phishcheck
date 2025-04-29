import { View, Text, StyleSheet, Animated } from "react-native";
import { Button } from "react-native-paper";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Questions = ({ section }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // 0 - starting from 1
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null);
  const progress = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

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
        const { data } = await axios.get(`/questions?section=${section}`);
        setQuestions(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [section]);

  const handleAnswer = (answer) => {
    const correctAnswer = currentQuestion.correct_answer.toLowerCase();
    const selected = answer.toLowerCase();
    setSelectedAnswer(answer);
    setIsCorrect(selected === correctAnswer);
    setShowExplanation(true);
    console.log("Selected: ", answer);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
    } else {
      navigation.navigate("Result");
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (!questions.length) return <Text>No questions found</Text>;

  const currentQuestion = questions[currentIndex];

  return (
    <View>
      <View>{renderProgress()}</View>
      <Text style={styles.title}>Question {currentIndex + 1}</Text>
      <Text style={styles.phraseText}>{currentQuestion.text}</Text>
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
        <View style={{ marginTop: 50 }}>
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
  title: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 10,
    paddingTop: 15,
  },

  phrase: {
    textAlign: "center",
    fontSize: 17,
    paddingBottom: 15,
  },

  phraseText: {
    textAlign: "center",
    fontSize: 17,
    paddingTop: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 30,
  },

  buttonContainerNext: {
    alignItems: "center",
    justifyContent: "center",
  },

  progress_bar: {
    bottom: 30,
    width: "100%",
    height: 15,
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
