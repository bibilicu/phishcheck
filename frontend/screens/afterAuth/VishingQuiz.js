import { View, Text, StyleSheet } from "react-native";
import { ProgressBar, MD3Colors } from "react-native-paper";
import React, { useEffect, useContext } from "react";
import ExitQuiz from "../../components/ExitQuiz";
import Questions from "../../components/Questions";
import { AuthContext } from "../../context/authContext";

const VishingQuiz = () => {
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
      <View style={{ position: "relative" }}>
        <Text style={styles.points}>0/100</Text>
      </View>
      <View style={{ position: "relative" }}>
        <ProgressBar
          style={styles.progress_bar}
          progress={0.5}
          color={MD3Colors}
        />
      </View>
      <Questions></Questions>
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

  points: {
    position: "absolute",
    right: 5,
    bottom: 100,
    fontSize: 20,
  },

  progress_bar: {
    position: "absolute",
    top: -70,
  },
});
