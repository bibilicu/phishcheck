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

const EmailVerify = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    try {
      setIsLoading(true);
      if (!code) {
        setIsLoading(false);
        return alert("Please provide the code to proceed.");
      }
      setIsLoading(false);
      navigation.navigate("Home");
      alert("Your account has been successfully verified!");
    } catch (error) {
      setIsLoading(false);
      alert(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account verification</Text>
      <Text style={styles.phrase}>
        Your account has been created, but we have sent you a code to get it
        verified. Worry not, it should come in any moment.
      </Text>
      <Separator />
      <TextInput
        style={styles.input}
        value={code}
        placeholder="The code received from email"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={(text) => setCode(text)}
      ></TextInput>
      <Separator />
      {isLoading ? (
        <ActivityIndicator size="large" color="#000ff" />
      ) : (
        <>
          <Button title="Continue" onPress={handleSubmit}></Button>
        </>
      )}
      <Separator />
      <Button
        title="Back"
        onPress={() => navigation.navigate("Welcome")}
      ></Button>
    </View>
  );
};

export default EmailVerify;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 15,
    textAlign: "center",
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
