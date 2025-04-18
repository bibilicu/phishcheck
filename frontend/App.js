import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Welcome from "./screens/Auth/Welcome";
import Login from "./screens/Auth/Login";
import Signup from "./screens/Auth/Signup";
import Home from "./screens/afterAuth/Home";
import EmailVerify from "./screens/Auth/EmailVerify";
import ResetPassword from "./screens/Auth/ResetPassword";
import PassCode from "./screens/Auth/PassCode";
import EmailPass from "./screens/Auth/EmailPass";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
          name="PassCode"
          component={PassCode}
          options={{ headerShown: false }} // introduce code to proceed to password reset
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
