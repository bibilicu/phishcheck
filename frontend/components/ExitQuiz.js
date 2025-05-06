import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Portal, Dialog } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import exit from "../assets/exit.png";

const ExitQuiz = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false); // if visible

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  return (
    <View>
      <View style={styles.exitButton}>
        <TouchableOpacity onPress={showDialog}>
          <Image source={exit} style={styles.exit} />
        </TouchableOpacity>
      </View>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={styles.dialogContainer}
        >
          <Dialog.Title>Confirm Exiting Quiz</Dialog.Title>
          <Dialog.Content>
            <Text style={{ fontSize: 15, marginTop: 10 }}>
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
              onPress={hideDialog}
            >
              No, keep me here!
            </Button>
            <Button
              style={{ borderRadius: 0 }}
              mode="elevated"
              buttonColor="#B53636"
              contentStyle={{ paddingVertical: 3, paddingHorizontal: 10 }}
              labelStyle={{ fontSize: 15, color: "#FFF" }}
              onPress={() => {
                hideDialog();
                navigation.navigate("Home");
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default ExitQuiz;

const styles = StyleSheet.create({
  exitButton: {
    position: "relative",
  },

  exit: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    position: "absolute",
    bottom: -70,
    left: -7,
  },

  dialogContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
