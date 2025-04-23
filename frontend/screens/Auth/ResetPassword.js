import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { Button, TextInput } from "react-native-paper";

const ResetPassword = ({ navigation }) => {
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    resetCode: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/password-reset", {
        resetCode,
        password,
        confirm_password,
      });
      alert(data && data.message);
      navigation.navigate("Login");
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
        Please introduce the code sent to you and the new password
      </Text>
      <TextInput
        style={styles.input}
        value={resetCode}
        label="The code received from email"
        autoCapitalize="none"
        onChangeText={(text) => {
          setResetCode(text);
          setError((prev) => ({ ...prev, resetCode: "" }));
        }}
      ></TextInput>
      {error.resetCode ? (
        <Text style={styles.errorMessage}>{error.resetCode}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        value={password}
        label="Your new password"
        autoCapitalize="none"
        secureTextEntry={!showPassword}
        onChangeText={(text) => {
          setPassword(text);
          setError((prev) => ({ ...prev, password: "" }));
        }}
      ></TextInput>
      {error.password ? (
        <Text style={styles.errorMessage}>{error.password}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        value={confirm_password}
        label="Confirm new password"
        autoCapitalize="none"
        secureTextEntry={!showPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setError((prev) => ({ ...prev, confirm_password: "" }));
        }}
      ></TextInput>
      {error.confirm_password ? (
        <Text style={styles.errorMessage}>{error.confirm_password}</Text>
      ) : null}
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: "#767577", true: "#0F184C" }}
          value={showPassword}
          onValueChange={(value) => setShowPassword(value)}
        />
        <Text style={styles.switchLabel}>Show Password</Text>
      </View>
      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000ff" />
        ) : (
          <>
            <Button
              style={{ borderRadius: 0 }}
              mode="elevated"
              buttonColor="#0F184C"
              contentStyle={{ paddingVertical: 3 }}
              labelStyle={{ fontSize: 15, color: "#FFF" }}
              onPress={handleSubmit}
            >
              Submit
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default ResetPassword;

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

  errorMessage: {
    color: "#B53636",
    fontSize: 13,
    marginVertical: 3,
    fontWeight: "bold",
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  switchLabel: {
    marginLeft: 10,
    fontSize: 15,
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },

  phrase: {
    textAlign: "center",
    marginBottom: 10,
  },
});
