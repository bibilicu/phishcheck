import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import Questions from "../../components/Questions";
import ExitQuiz from "../../components/ExitQuiz";
import { AuthContext } from "../../context/authContext";

const PhishingQuiz = () => {
  const [state, setState, handleLogout] = useContext(AuthContext);

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

  return (
    <View style={styles.container}>
      <ExitQuiz />
      <Questions section_type="Introduction to Phishing" user={state.user} />
    </View>
  );
};

export default PhishingQuiz;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#648FDE",
  },
});
