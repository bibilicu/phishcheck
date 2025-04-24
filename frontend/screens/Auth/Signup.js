import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import React, { useState, useContext } from "react";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";

// for tomorrow, complete functionality and validation

const Signup = ({ navigation }) => {
  const [full_name, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [training_status, setTrainingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [error, setError] = useState({
    full_name: "",
    department: "",
    email: "",
    password: "",
    confirm_password: "",
    training_status: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const dataTraining = [
    { label: "3-6 months", value: "3-6 months" },
    { label: "6-9 months", value: "6-9 months" },
    { label: "+1 year", value: "+1 year" },
    { label: "Never", value: "Never" },
  ];

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/create-account", {
        full_name,
        department,
        email,
        password,
        confirm_password,
        training_status,
      });
      navigation.navigate("EmailVerify");
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
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        value={full_name}
        label="Full Name"
        mode="flat"
        autoCapitalize="none"
        onChangeText={(text) => {
          setFullName(text);
          setError((prev) => ({ ...prev, full_name: "" }));
        }}
      ></TextInput>
      {error.full_name ? (
        <Text style={styles.errorMessage}>{error.full_name}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        value={department}
        label="Department (e.g. IT, HR, Finance)"
        mode="flat"
        autoCapitalize="none"
        onChangeText={(text) => {
          setDepartment(text);
          setError((prev) => ({ ...prev, department: "" }));
        }}
      ></TextInput>
      {error.department ? (
        <Text style={styles.errorMessage}>{error.department}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        value={email}
        label="Business Email"
        mode="flat"
        autoCapitalize="none"
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
        mode="flat"
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
        label="Confirm your password"
        mode="flat"
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
      <Dropdown
        style={[styles.dropdown, isFocus]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={dataTraining}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "How long since the last training?" : "..."}
        value={training_status}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setTrainingStatus(item.value);
          setError((prev) => ({ ...prev, training_status }));
          setIsFocus(false);
        }}
      />
      {error.training_status ? (
        <Text style={styles.errorMessage}>{error.training_status}</Text>
      ) : null}
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: "#3A3A3A", true: "#0F184C" }}
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
              Submit
            </Button>
          </>
        )}
      </View>
      {/* {error ? <Text style={styles.errorMessage}>{error}</Text> : null} */}
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
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#648FDE",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  input: {
    marginVertical: 7,
    fontSize: 14,
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

  phrase: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  link: {
    color: "blue",
    fontWeight: "bold",
  },

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    marginTop: 10,
  },

  icon: {
    marginRight: 5,
  },

  errorMessage: {
    color: "#B53636",
    fontSize: 13,
    marginVertical: 3,
    fontWeight: "bold",
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
    fontSize: 14,
    marginLeft: 10,
    color: "grey",
  },
  selectedTextStyle: {
    fontSize: 14,
    marginLeft: 10,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },
});
