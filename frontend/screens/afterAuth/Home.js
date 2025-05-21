import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  BackHandler,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../context/authContext";
import { Button, Portal, Dialog, Card } from "react-native-paper";
import axios from "axios";
import cybercrime from "../../assets/cybercrime.png";
import phishing from "../../assets/phishing.png";
import smishing from "../../assets/smishing.png";
import vishing from "../../assets/vishing.png";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import exit from "../../assets/exit.png";

const Home = () => {
  const [state, setState, handleLogout] = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalScore, setTotalScore] = useState(null);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const navigation = useNavigation();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const surveyURL = "https://forms.gle/Fi8tjNQ3rmPRQcrm7";

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        setLogoutConfirmVisible(true);
        return true;
      };

      const beforeRemove = navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
        setLogoutConfirmVisible(true);
      });
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => {
        backHandler.remove();
        navigation.removeListener("beforeRemove", beforeRemove);
      };
    }, [navigation, handleLogout])
  );

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get("/home", {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
      } catch (error) {
        setIsLoading(false);
        console.error("Token expired or invalid: ", error);
        alert("Your session has expired, please log in again.", [
          {
            text: "Ok",
            onPress: () => {
              handleLogout();
            },
          },
        ]);
      }
    };

    if (state.token) {
      verifyToken();
    } else {
      handleLogout();
    }
  }, [state.token]);

  // total score of the employee
  useEffect(() => {
    const fetch_score = async () => {
      try {
        const { data } = await axios.get(`/results/total/${state.user._id}`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setTotalScore(data.total_score);
      } catch (error) {
        console.error("Failed to fetch score.", error);
      }
    };

    if (state.user && state.token) {
      fetch_score();
    }
  }, [state.user, state.token]);

  const handleLogoutDialog = () => {
    hideDialog();
    handleLogout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.exitButton}>
        <TouchableOpacity onPress={showDialog}>
          <Image source={exit} style={styles.exit} />
        </TouchableOpacity>
      </View>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={styles.dialogContainer}
        >
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text style={{ fontSize: 15, marginTop: 10, textAlign: "center" }}>
              Are you sure you want to log out?
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.actionsContainer}>
            <Button
              style={{ borderRadius: 0 }}
              mode="elevated"
              buttonColor="#0F184C"
              contentStyle={{
                paddingVertical: 3,
                paddingHorizontal: 8,
              }}
              labelStyle={{ fontSize: 15, color: "#FFF" }}
              onPress={hideDialog}
            >
              Cancel
            </Button>
            <Button
              style={{ borderRadius: 0 }}
              mode="elevated"
              buttonColor="#B53636"
              contentStyle={{ paddingVertical: 3, paddingHorizontal: 10 }}
              labelStyle={{ fontSize: 15, color: "#FFF" }}
              onPress={handleLogoutDialog}
            >
              Log Out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* for default gesture */}
      <Portal>
        <Dialog
          visible={logoutConfirmVisible}
          onDismiss={() => setLogoutConfirmVisible(false)}
          style={styles.dialogContainer}
        >
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text style={{ fontSize: 15, marginTop: 10, textAlign: "center" }}>
              Are you sure you want to log out?
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.actionsContainer}>
            <Button
              style={{ borderRadius: 0 }}
              mode="elevated"
              buttonColor="#0F184C"
              contentStyle={{
                paddingVertical: 3,
                paddingHorizontal: 8,
              }}
              labelStyle={{ fontSize: 15, color: "#FFF" }}
              onPress={() => setLogoutConfirmVisible(false)}
            >
              Cancel
            </Button>
            <Button
              style={{ borderRadius: 0 }}
              mode="elevated"
              buttonColor="#B53636"
              contentStyle={{ paddingVertical: 3, paddingHorizontal: 10 }}
              labelStyle={{ fontSize: 15, color: "#FFF" }}
              onPress={() => {
                setLogoutConfirmVisible(false);
                handleLogoutDialog;
              }}
            >
              Log Out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Text style={styles.title}>
        Welcome {state.user ? state.user.anonymous_id : "Guest"}!
      </Text>
      <Text
        style={[
          styles.phrase,
          {
            fontWeight: "bold",
            marginTop: 10,
            textDecorationLine: "underline",
          },
        ]}
      >
        Your total score: {typeof totalScore === "number" ? totalScore : 0}
      </Text>
      <View style={styles.cardContainer}>
        <Card mode="elevated" style={{ width: 170, height: 210 }}>
          <Card.Content
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={cybercrime} style={styles.picture} />
            <Text variant="titleLarge" style={styles.cardTitle}>
              Introduction to Phishing
            </Text>
            <Card.Actions style={{ marginTop: 15, marginRight: 5 }}>
              <Button
                style={{
                  borderRadius: 0,
                }}
                mode="elevated"
                buttonColor="#0F184C"
                contentStyle={{ paddingVertical: 3 }}
                labelStyle={{ fontSize: 15, color: "#FFF" }}
                onPress={() => navigation.navigate("PhishingQuiz")}
              >
                Start
              </Button>
            </Card.Actions>
          </Card.Content>
        </Card>

        <Card
          mode="elevated"
          style={{
            width: 170,
            height: 210,
          }}
        >
          <Card.Content
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={phishing} style={styles.picture} />
            <Text variant="titleLarge" style={styles.cardTitle}>
              Email Phishing
            </Text>
            <Card.Actions style={{ marginTop: 31, marginRight: 5 }}>
              <Button
                style={{ borderRadius: 0 }}
                mode="elevated"
                buttonColor="#0F184C"
                contentStyle={{
                  paddingVertical: 3,
                }}
                labelStyle={{ fontSize: 15, color: "#FFF" }}
                onPress={() => navigation.navigate("EmailQuiz")}
              >
                Start
              </Button>
            </Card.Actions>
          </Card.Content>
        </Card>
      </View>
      {/* second container */}
      <View style={styles.cardContainer}>
        <Card mode="elevated" style={{ width: 170, height: 210 }}>
          <Card.Content
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={smishing} style={styles.picture} />
            <Text variant="titleLarge" style={styles.cardTitle}>
              Smishing (SMS Phishing)
            </Text>
            <Card.Actions style={{ marginTop: 15, marginRight: 5 }}>
              <Button
                style={{
                  borderRadius: 0,
                }}
                mode="elevated"
                buttonColor="#0F184C"
                contentStyle={{ paddingVertical: 3 }}
                labelStyle={{ fontSize: 15, color: "#FFF" }}
                onPress={() => navigation.navigate("SmsQuiz")}
              >
                Start
              </Button>
            </Card.Actions>
          </Card.Content>
        </Card>

        <Card
          mode="elevated"
          style={{
            width: 170,
            height: 210,
          }}
        >
          <Card.Content
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={vishing} style={styles.picture} />
            <Text variant="titleLarge" style={styles.cardTitle}>
              Vishing (Voice Phishing)
            </Text>
            <Card.Actions style={{ marginTop: 15, marginRight: 5 }}>
              <Button
                style={{ borderRadius: 0 }}
                mode="elevated"
                buttonColor="#0F184C"
                contentStyle={{
                  paddingVertical: 3,
                }}
                labelStyle={{ fontSize: 15, color: "#FFF" }}
                onPress={() => navigation.navigate("VishingQuiz")}
              >
                Start
              </Button>
            </Card.Actions>
          </Card.Content>
        </Card>
      </View>
      <Text style={styles.phrase_survey}>
        Your opinion matters into making this quiz better.
      </Text>
      <TouchableOpacity onPress={() => Linking.openURL(surveyURL)}>
        <Text style={styles.link}>
          Take this short survey to help us improve the game!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#648FDE",
  },

  title: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20,
  },

  phrase: {
    textAlign: "center",
    fontSize: 17,
  },

  exitButton: {
    position: "absolute",
    top: 75,
    left: 10,
  },

  exit: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },

  picture: {
    width: 68,
    height: 68,
    alignSelf: "center",
    marginBottom: 8,
  },

  cardTitle: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
  },

  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  phrase_survey: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },

  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 10,
  },

  dialogContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "blue",
    fontWeight: "bold",
    textAlign: "center",
  },
});
