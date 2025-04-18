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

const EmailPass = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    try {
      setIsLoading(true);
      if (!email) {
        setIsLoading(false);
        return alert("Email is required.");
      }
      setIsLoading(false);
      navigation.navigate("PassCode");
    } catch (error) {
      setIsLoading(false);
      alert(error);
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
        placeholder="Your business email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
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
      <Button
        title="Back to Login"
        onPress={() => navigation.navigate("Login")}
      ></Button>
    </View>
  );
};

export default EmailPass;

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
