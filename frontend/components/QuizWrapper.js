import { View, Text, StyleSheet, BackHandler } from "react-native";
import React, { useCallback, useState } from "react";
import { Portal, Dialog, Button } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";

const QuizWrapper = ({ quizAttemptId, children }) => {
  const navigation = useNavigation();
  const [pending, setPending] = useState(null);
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);

  const confirmExit = async (action) => {
    try {
      if (quizAttemptId) {
        await axios.post("/quiz-attempt/complete", {
          quiz_attempt_id: quizAttemptId,
          abandoned: true,
        });
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      if (action) {
        navigation.dispatch(action);
      } else {
        navigation.goBack();
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      // iOS
      const beforeRemoveListener = (e) => {
        e.preventDefault();
        setPending(e.data.action);
        setExitConfirmVisible(true);
      };

      // android
      const handleBackHandler = () => {
        setPending(null);
        setExitConfirmVisible(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackHandler
      );

      return () => {
        backHandler.remove();
        navigation.removeListener("beforeRemove", beforeRemoveListener);
      };
    }, [navigation, quizAttemptId])
  );

  return (
    <View style={{ flex: 1 }}>
      <Portal>
        <Dialog
          visible={exitConfirmVisible}
          onDismiss={() => {
            setExitConfirmVisible(false);
            setPending(null);
          }}
          style={styles.dialogContainer}
        >
          <Dialog.Title>Confirm Exiting Quiz</Dialog.Title>
          <Dialog.Content>
            <Text style={{ fontSize: 15, marginTop: 10, textAlign: "center" }}>
              Are you sure you want to quit this quiz? You cannot start from
              where you left.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.actionsContainer}>
            <Button
              style={{ borderRadius: 0 }}
              mode="elevated"
              buttonColor="#0F184C"
              contentStyle={{
                paddingVertical: 3,
                paddingHorizontal: 8,
              }}
              labelStyle={{ fontSize: 15, color: "#FFF" }}
              onPress={() => {
                setExitConfirmVisible(false);
                setPending(null);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{ borderRadius: 0 }}
              mode="elevated"
              buttonColor="#B53636"
              contentStyle={{ paddingVertical: 3, paddingHorizontal: 10 }}
              labelStyle={{ fontSize: 15, color: "#FFF" }}
              onPress={async () => {
                setExitConfirmVisible(false);
                await confirmExit(pending);
                setPending(null);
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {children}
    </View>
  );
};

export default QuizWrapper;

const styles = StyleSheet.create({
  exit: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },

  dialogContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 10,
  },
});
