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

const ResetPassword = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    try {
      setIsLoading(true);
      if (!password) {
        setIsLoading(false);
        return alert("Please provide the new password");
      }
      setIsLoading(false);
      navigation.navigate("Login");
      alert("Password has been reset, please login with your new credentials.");
    } catch (error) {
      setIsLoading(false);
      alert(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phrase}>
        Please introduce the code sent to you and the new password
      </Text>
      <TextInput
        style={styles.input}
        value={code}
        placeholder="The code received from email"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={(text) => setCode(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Your new password"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={confirm_password}
        placeholder="Confirm new password"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={(text) => setConfirmPassword(text)}
      ></TextInput>
      <Separator />
      {isLoading ? (
        <ActivityIndicator size="large" color="#000ff" />
      ) : (
        <>
          <Button title="Submit" onPress={handleSubmit}></Button>
        </>
      )}
      <Separator />
    </View>
  );
};

export default ResetPassword;

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
});
