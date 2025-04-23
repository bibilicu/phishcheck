import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from "react-native";
import React, { useState, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/authContext";
import { Button, TextInput } from "react-native-paper";

const Login = ({ navigation }) => {
  const [state, setState] = useContext(AuthContext);
  const [error, setError] = useState({ email: "", password: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/login", {
        email,
        password,
      });
      setState(data);
      await AsyncStorage.setItem("@auth", JSON.stringify(data));
      alert(data && data.message);
      navigation.navigate("Home");
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
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        label="Your business email"
        mode="outlined"
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
      <TextInput
        style={styles.input}
        value={password}
        label="Password"
        mode="outlined"
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
              contentStyle={{ paddingVertical: 3, paddingHorizontal: 8 }}
              labelStyle={{ fontSize: 15, color: "#FFF" }}
              onPress={handleSubmit}
            >
              Login
            </Button>
          </>
        )}
      </View>
      <Text style={styles.phrase}>
        Are you new here?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
          Create an account!
        </Text>
        {""}
      </Text>
      <Text style={styles.phrase}>
        Forgot your password?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("EmailPass")}
        >
          Restore it here!
        </Text>
        {""}
      </Text>
    </View>
  );
};

export default Login;

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#648FDE",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
    marginVertical: 20,
  },

  phrase: {
    textAlign: "center",
    marginVertical: 7,
    fontWeight: "bold",
  },
  link: {
    color: "blue",
    fontWeight: "bold",
  },
});
