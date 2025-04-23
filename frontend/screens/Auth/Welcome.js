import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button } from "react-native-paper";

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <Text style={styles.title}>PhishCheck</Text>
        <Text style={styles.subtitle}>
          Improve or keep your phishing awareness fresh. In or out work.
        </Text>
        <Text style={styles.subtitle}>Anywhere. Anytime.</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={{ borderRadius: 0 }}
          mode="elevated"
          buttonColor="#0F184C"
          contentStyle={{
            paddingVertical: 5,
            paddingHorizontal: 8,
          }}
          labelStyle={{ fontSize: 15, color: "#FFF" }}
          onPress={() => navigation.navigate("Signup")}
        >
          Let's get started!
        </Button>
        <Button
          style={{ borderRadius: 0, borderColor: "#0F184C", borderWidth: 3 }}
          mode="elevated"
          buttonColor="#FFF"
          contentStyle={{ paddingVertical: 5, paddingHorizontal: 3 }}
          labelStyle={{ fontSize: 15, color: "#0F184C", fontWeight: "bold" }}
          onPress={() => navigation.navigate("Login")}
        >
          Already registered
        </Button>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#648FDE",
  },

  intro: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 150,
  },

  title: {
    fontSize: 45,
    marginBottom: 15,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    textAlign: "center",
    marginTop: 15,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 40,
  },
});
