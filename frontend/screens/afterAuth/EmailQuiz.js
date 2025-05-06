import { View, Text, StyleSheet } from "react-native";
import { ProgressBar, MD3Colors } from "react-native-paper";
import React, { useEffect, useContext } from "react";
import ExitQuiz from "../../components/ExitQuiz";
import Questions from "../../components/Questions";
import { AuthContext } from "../../context/authContext";

const EmailQuiz = () => {
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
      <Questions section_type="Email" user={state.user}></Questions>
    </View>
  );
};

export default EmailQuiz;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#648FDE",
  },
});
