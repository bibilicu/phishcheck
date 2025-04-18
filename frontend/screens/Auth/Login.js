import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState } from "react";

const Separator = () => <View style={styles.separator}></View>;

// for tomorrow, complete functionality and validation

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    try {
      setIsLoading(true);
      if (!email || !password) {
        setIsLoading(false);
        return alert("Please fill in the fields.");
      }
      setIsLoading(false);
      navigation.navigate("Home");
    } catch (error) {
      setIsLoading(false);
      alert(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Your business email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        onChangeText={(text) => setEmail(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      ></TextInput>
      <Separator />
      {isLoading ? (
        <ActivityIndicator size="large" color="#000ff" />
      ) : (
        <>
          <Button title="Log in" onPress={handleSubmit}></Button>
        </>
      )}
      <Separator />
      <Button
        title="Back"
        onPress={() => navigation.navigate("Welcome")}
      ></Button>
      <Separator />
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

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  separator: {
    margin: 5,
  },
  phrase: {
    textAlign: "center",
  },
  link: {
    color: "blue",
  },
});
