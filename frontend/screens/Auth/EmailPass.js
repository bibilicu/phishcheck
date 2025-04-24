import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { Button, TextInput } from "react-native-paper";

const EmailPass = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ email: "" });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/send-code", { email });
      alert(data && data.message);
      navigation.navigate("ResetPassword");
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong, please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phrase}>
        Please introduce your bussiness email to receive the code.
      </Text>
      <TextInput
        style={styles.input}
        value={email}
        label="Your business email"
        mode="flat"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        onChangeText={(text) => {
          setEmail(text);
          setError((prev) => ({ ...prev, email: "" }));
        }}
      ></TextInput>
      {error.email ? (
        <Text style={styles.errorMessage}>{error.email}</Text>
      ) : null}
      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000ff" />
        ) : (
          <>
            <Button
              style={{ borderRadius: 0 }}
              mode="elevated"
              buttonColor="#0F184C"
              contentStyle={{ paddingVertical: 3, paddingHorizontal: 8 }}
              labelStyle={{ fontSize: 15, color: "#FFF" }}
              onPress={handleSubmit}
            >
              Send
            </Button>
          </>
        )}

        <Button
          style={{ borderRadius: 0 }}
          mode="elevated"
          buttonColor="#0F184C"
          contentStyle={{ paddingVertical: 3, paddingHorizontal: 8 }}
          labelStyle={{ fontSize: 15, color: "#FFF" }}
          onPress={() => navigation.navigate("Welcome")}
        >
          Back
        </Button>
      </View>
    </View>
  );
};

export default EmailPass;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#648FDE",
  },

  input: {
    marginVertical: 7,
    fontSize: 14,
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  phrase: {
    textAlign: "center",
    marginBottom: 20,
  },

  errorMessage: {
    color: "#B53636",
    fontSize: 13,
    marginVertical: 3,
    fontWeight: "bold",
  },
});
