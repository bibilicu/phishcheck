import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { Button, TextInput } from "react-native-paper";

const EmailVerify = ({ navigation }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ code: "" });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/verify-email", {
        verificationCode,
      });
      alert(data && data.message);
      console.log("Verification successful.");
      navigation.navigate("Home");
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong with verification, please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phrase}>
        Your account has been created, but we have sent you a code to get it
        verified. Worry not, it should come in any moment.
      </Text>

      <TextInput
        style={styles.input}
        value={verificationCode}
        placeholder="The code received from email"
        autoCapitalize="none"
        onChangeText={(text) => {
          setVerificationCode(text);
          setError((prev) => ({ ...prev, verificationCode: "" }));
        }}
      ></TextInput>
      {error.verificationCode ? (
        <Text style={styles.errorMessage}>{error.verificationCode}</Text>
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
            ></Button>
          </>
        )}
      </View>
    </View>
  );
};

export default EmailVerify;

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
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
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
