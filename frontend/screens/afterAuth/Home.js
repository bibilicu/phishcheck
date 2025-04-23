import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { Button } from "react-native-paper";
import axios from "axios";

const Home = () => {
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
        handleLogout();
      }
    };

    if (state?.token) {
      verifyToken();
    } else {
      handleLogout();
    }
  }, []);

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
          onPress={handleLogout}
        >
          Logout
        </Button>
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
});
