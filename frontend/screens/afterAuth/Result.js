import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const Result = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Result</Text>
      <Button
        onPress={() => navigation.navigate("Home")}
        title="Back to Home"
      ></Button>
    </View>
  );
};

export default Result;
