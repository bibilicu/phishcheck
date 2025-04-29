import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Welcome from "./screens/Auth/Welcome";
import Login from "./screens/Auth/Login";
import Signup from "./screens/Auth/Signup";
import Home from "./screens/afterAuth/Home";
import EmailVerify from "./screens/Auth/EmailVerify";
import ResetPassword from "./screens/Auth/ResetPassword";
import EmailPass from "./screens/Auth/EmailPass";
import PhishingQuiz from "./screens/afterAuth/PhishingQuiz";
import EmailQuiz from "./screens/afterAuth/EmailQuiz";
import SmsQuiz from "./screens/afterAuth/SmsQuiz";
import VishingQuiz from "./screens/afterAuth/VishingQuiz";
import { AuthProvider } from "./context/authContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView, StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import Result from "./screens/afterAuth/Result";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ScrollView
        style={styles.containerScroll}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <PaperProvider>
          <NavigationContainer>
            <AuthProvider>
              <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen
                  name="Welcome"
                  component={Welcome}
                  options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                  name="Signup"
                  component={Signup}
                  options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                  name="EmailVerify"
                  component={EmailVerify}
                  options={{ headerShown: false }} // to get the user's email verified
                />
                <Stack.Screen
                  name="EmailPass"
                  component={EmailPass}
                  options={{ headerShown: false }} // email to receive code for password reset
                />
                <Stack.Screen
                  name="ResetPassword"
                  component={ResetPassword}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                  name="PhishingQuiz"
                  component={PhishingQuiz}
                  options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                  name="EmailQuiz"
                  component={EmailQuiz}
                  options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                  name="SmsQuiz"
                  component={SmsQuiz}
                  options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                  name="VishingQuiz"
                  component={VishingQuiz}
                  options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                  name="Result"
                  component={Result}
                  options={{ headerShown: false }}
                ></Stack.Screen>
              </Stack.Navigator>
            </AuthProvider>
          </NavigationContainer>
        </PaperProvider>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1,
  },

  contentContainer: {
    flexGrow: 1,
  },
});
