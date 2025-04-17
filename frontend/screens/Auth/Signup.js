import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";

const Separator = () => <View style={styles.separator}></View>;

// for tomorrow, complete functionality and validation

const Signup = ({ navigation }) => {
  const [full_name, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [training_status, setTrainingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const data = [
    { label: "3-6 months", value: "3-6 months" },
    { label: "6-9 months", value: "6-9 months" },
    { label: "+1 year", value: "+1 year" },
    { label: "Never", value: "Never" },
  ];

  const handleSubmit = () => {
    try {
      setIsLoading(true);
      if (
        !full_name ||
        !department ||
        !email ||
        !phone_number ||
        !password ||
        !training_status
      ) {
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
      <Text>Create your account here</Text>
      <TextInput
        style={styles.input}
        value={full_name}
        placeholder="Full Name"
        autoCapitalize="none"
        onChangeText={(text) => setFullName(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={department}
        placeholder="Department (e.g. IT, HR, Finance)"
        autoCapitalize="none"
        onChangeText={(text) => setDepartment(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Your business email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={phone_number}
        placeholder=" Phone Number"
        onChangeText={(text) => setPhoneNumber(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      ></TextInput>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "How long since the last training?" : "..."}
        value={training_status}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setTrainingStatus(item.value);
          setIsFocus(false);
        }}
      />
      <Separator />
      {isLoading ? (
        <ActivityIndicator size="large" color="#000ff" />
      ) : (
        <>
          <Button title="Sign Up" onPress={handleSubmit}></Button>
        </>
      )}
      <Separator />
      <Button
        title="Back"
        onPress={() => navigation.navigate("Welcome")}
      ></Button>
      <Separator />
      <Text style={styles.phrase}>
        Already registered?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Log in here!
        </Text>
      </Text>
      {""}
    </View>
  );
};

export default Signup;

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
  dropdown: {
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    marginTop: 3,
  },
  icon: {
    marginRight: 5,
  },

  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
