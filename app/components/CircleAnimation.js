import React, { useEffect, useRef } from "react";
import { useColorScheme, Animated, View, StyleSheet, Dimensions, Easing } from "react-native";

const avenuBlueLight = "#8ADDFF";
const avenuBlueDark = "#04395E";
const steel = "#1D1C1C";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Circle = ({ delay, color }) => {
  const theme = useColorScheme();
  const scale = useRef(new Animated.Value(0)).current; // Initial scale set to 0

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1, // Animate to scale 1
      duration: 2500, // individual circle animation
      delay: delay, // Delay before each circle animates
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  // Animated style for the circle
  const animatedStyle = {
    //opacity: opacitySwitch ? scale : 1, // Conditional opacity change
    transform: [
      {
        scale: scale.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 15], // Scale from 1 -> 20
          extrapolate: "clamp",
        }),
      },
    ],
    backgroundColor: scale.interpolate({
      inputRange: [0, 1],
      outputRange: [theme === "dark" ? steel : "white", color], // Opacity color change
      extrapolate: "clamp",
    }),
  };

  return <Animated.View style={[styles.circle, animatedStyle]} />;
};

const WhiteCircle = () => {
  return <View style={styles.whiteCircle}></View>;
};
const TextHandler = ({ props }) => {
  return <View style={styles.text}>{props}</View>;
};

export default function CircleAnimation({ children }) {
  const theme = useColorScheme();

  return (
    <Animated.View style={styles.container}>
      <TextHandler props={children} />
      {/* <WhiteCircle></WhiteCircle> */}

      {/* Animated blue circles */}
      <Circle
        delay={0}
        color={theme === "dark" ? avenuBlueDark : avenuBlueLight}
        opacitySwitch={true}
      />
      <Circle
        delay={300}
        color={theme === "dark" ? avenuBlueDark : avenuBlueLight}
        opacitySwitch={true}
      />
      <Circle
        delay={500}
        color={theme === "dark" ? avenuBlueDark : avenuBlueLight}
        opacitySwitch={true}
      />
      <Circle
        delay={700}
        color={theme === "dark" ? avenuBlueDark : avenuBlueLight}
        opacitySwitch={true}
      />
      <Circle delay={1000} color={theme === "dark" ? steel : "white"} opacitySwitch={false} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    zIndex: 200,
  },
  container: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  circle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  whiteCircle: {
    position: "absolute",
    width: 120, // Size of the static white circle
    height: 120, // Size of the static white circle
    borderRadius: 60, // Half of the size to make it circular
    backgroundColor: "white", // White background to cover text area
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100, // Make sure it stays above the animated circles
  },
});
