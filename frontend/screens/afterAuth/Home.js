import { View, Text, Button } from "react-native";
import React from "react";

const Home = ({ navigation }) => {
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Back"
        onPress={() => navigation.navigate("Welcome")}
      ></Button>
    </View>
  );
};

export default Home;
