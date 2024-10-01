import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AnimatedView from "../components/AnimatedView";
import { View, Animated, StyleSheet, Easing } from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import RingAnimation from "../components/RingAnimation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Greeting">;
};

const Greeting: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("Guest");
  const fadeGreeting = useState(new Animated.Value(0))[0]; // Initial opacity for greeting
  const fadeUsername = useState(new Animated.Value(0))[0]; // Initial opacity for username
  const [greeting, setGreeting] = useState("Welcome");

  const _onFinish = () => {
    // navigation.navigate("Home");
    // alert("done");
  };
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUsername(user.email || "Guest"); // Use displayName or email if displayName is not set
    }

    // Determine the greeting based on the current time
    const hour = new Date().getHours();
    if (hour > 3 && hour < 12) {
      setGreeting("Good morning");
    }
    if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 || hour <= 3) {
      setGreeting("Good evening");
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <RingAnimation>
        <AnimatedView
          content={`${greeting} ${username}`}
          textStyle={styles.greetingText}
          duration={500}
          onFinish={_onFinish}
        />
      </RingAnimation>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Greeting;
