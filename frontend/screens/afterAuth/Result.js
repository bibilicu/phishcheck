import { View, Text, Button } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const Result = () => {
  const [state, setState, handleLogout] = useContext(AuthContext);
  const [totalScore, setTotalScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const route = useRoute();
  const { timer_left, time_spent, quiz_id } = route.params || {};

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get("/home", {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
      } catch (error) {
        setIsLoading(false);
        console.error("Token expired or invalid: ", error);
        alert("Your session has expired, please log in again.", [
          {
            text: "Ok",
            onPress: () => {
              handleLogout();
            },
          },
        ]);
      }
    };

    if (state.token) {
      verifyToken();
    } else {
      handleLogout();
    }
  }, [state.token]);

  // total score of the employee
  useEffect(() => {
    const fetch_quiz_score = async () => {
      try {
        const { data } = await axios.get(
          `/quiz-score/${state.user._id}/${quiz_id}`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        setTotalScore(data.totalScore);
      } catch (error) {
        console.error("Failed to fetch score.", error);
      }
    };

    if (state.user && state.token) {
      fetch_quiz_score();
    }
  }, [state.user, state.token]);

  const timer_format = (sec) => {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  return (
    <View>
      <Text>Result</Text>
      <Text>Your results:</Text>
      {timer_left !== undefined ? (
        <>
          <Text>Time Left: {timer_format(timer_left)}</Text>
          <Text>Time Spent: {timer_format(time_spent)}</Text>
        </>
      ) : (
        <Text>No time sent.</Text>
      )}
      <Text>Your score: {totalScore !== null ? totalScore : "Loading"}</Text>
      <Button
        onPress={() => navigation.navigate("Home")}
        title="Back to Home"
      ></Button>
    </View>
  );
};

export default Result;
