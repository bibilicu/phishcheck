import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

// context
const AuthContext = createContext();

// provider
const AuthProvider = ({ children }) => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    user: null,
    token: "",
  });

  axios.defaults.baseURL = "http://172.20.10.2:5000/api";

  useEffect(() => {
    const loadStorage = async () => {
      try {
        let data = await AsyncStorage.getItem("@auth");
        let parseData = JSON.parse(data);
        if (parseData?.user && parseData?.token) {
          setState({
            user: parseData.user,
            token: parseData.token,
          });
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${parseData.token}`;
        }
      } catch (error) {
        console.log("Error loading from storage: ", error);
      }
    };

    loadStorage();

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // global logout
  const handleLogout = async () => {
    console.log("logout");
    await AsyncStorage.removeItem("@auth");
    setState({ user: null, token: "" });
    navigation.navigate("Welcome");
  };

  return (
    <AuthContext.Provider value={[state, setState, handleLogout]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
