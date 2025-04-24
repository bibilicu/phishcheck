import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Button, Portal, Dialog } from "react-native-paper";
import axios from "axios";

const Home = () => {
  const [state, setState, handleLogout] = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get("/home", {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
      } catch (error) {
        handleLogout();
      }
    };

    if (state?.token) {
      verifyToken();
    } else {
      handleLogout();
    }
  }, []);

  const handleLogoutDialog = () => {
    hideDialog();
    handleLogout();
  };

  return (
    <View>
      <Text>Home</Text>
      <Text>{JSON.stringify(state, null, 4)}</Text>
      <View style={styles.buttonContainer}>
        <Button
          style={{ borderRadius: 0 }}
          mode="elevated"
          buttonColor="#0F184C"
          contentStyle={{ paddingVertical: 3, paddingHorizontal: 8 }}
          labelStyle={{ fontSize: 15, color: "#FFF" }}
          onPress={showDialog}
        >
          Logout
        </Button>
        <Portal>
          <Dialog
            visible={visible}
            onDismiss={hideDialog}
            style={styles.dialogContainer}
          >
            <Dialog.Title>Confirm Logout</Dialog.Title>
            <Dialog.Content>
              <Text style={{ fontSize: 15, marginTop: 10 }}>
                Are you sure you want to log out?
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.actionsContainer}>
              <Button
                style={{ borderRadius: 0 }}
                mode="elevated"
                buttonColor="#0F184C"
                contentStyle={{ paddingVertical: 3, paddingHorizontal: 8 }}
                labelStyle={{ fontSize: 15, color: "#FFF" }}
                onPress={hideDialog}
              >
                Cancel
              </Button>
              <Button
                style={{ borderRadius: 0 }}
                mode="elevated"
                buttonColor="#B53636"
                contentStyle={{ paddingVertical: 3, paddingHorizontal: 10 }}
                labelStyle={{ fontSize: 15, color: "#FFF" }}
                onPress={handleLogoutDialog}
              >
                Log Out
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 10,
  },

  dialogContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
