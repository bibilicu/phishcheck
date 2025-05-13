import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
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
          `/results/${state.user._id}/${quiz_id}`,
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
    <View style={styles.container}>
      <Text style={{ textAlign: "center" }}>Result</Text>
      <Text style={{ textAlign: "center" }}>Your results:</Text>
      {timer_left !== undefined ? (
        <>
          <Text style={{ textAlign: "center" }}>
            Time Left: {timer_format(timer_left)}
          </Text>
          <Text style={{ textAlign: "center" }}>
            Time Spent: {timer_format(time_spent)}
          </Text>
        </>
      ) : (
        <Text style={{ textAlign: "center" }}>No time sent.</Text>
      )}
      <Text style={{ textAlign: "center" }}>
        Your score: {totalScore !== null ? totalScore : "Loading"}
      </Text>
      <View style={styles.buttonContainerNext}>
        <Button
          style={{ borderRadius: 0 }}
          mode="elevated"
          buttonColor="#0F184C"
          contentStyle={{ paddingVertical: 7, paddingHorizontal: 8 }}
          labelStyle={{ fontSize: 17, color: "#FFF" }}
          onPress={() => navigation.navigate("Home")}
        >
          Back to Home
        </Button>
      </View>
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#648FDE",
    fontSize: 17,
    fontWeight: "bold",
  },
  buttonContainerNext: {
    alignItems: "center",
    justifyContent: "center",
  },
});
