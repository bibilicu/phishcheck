import { View, StyleSheet } from "react-native";
import React, { useEffect, useContext } from "react";
import ExitQuiz from "../../components/ExitQuiz";
import Questions from "../../components/Questions";
import { AuthContext } from "../../context/authContext";
import QuizWrapper from "../../components/QuizWrapper";

const VishingQuiz = ({ quizAttemptId }) => {
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
      <QuizWrapper quizAttemptId={quizAttemptId}>
        <ExitQuiz />
        <Questions section_type="Vishing" user={state.user}></Questions>
      </QuizWrapper>
    </View>
  );
};

export default VishingQuiz;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#648FDE",
  },
});
