import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";

const Separator = () => <View style={styles.separator}></View>;

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PhishCheck</Text>
      <Text style={styles.subtitle}>
        Improve or keep your phishing awareness fresh. In or out work.
      </Text>
      <Text style={styles.subtitle}>Anywhere. Anytime.</Text>
      <Separator></Separator>
      <Button
        title="Let's get started!"
        onPress={() => navigation.navigate("Signup")}
      />
      <Separator></Separator>
      <Button
        title="Already registered"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "",
  },
  title: {
    fontSize: 30,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    textAlign: "center",
    marginBottom: 10,
  },
  separator: {
    margin: 5,
  },
});
