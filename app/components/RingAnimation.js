import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  withRepeat,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Text, View, StyleSheet } from "react-native";

const avenuBlue = "#8ADDFF";
const Circle = ({ delay, color, opacitySwitch }) => {
  const circle = useSharedValue(0);
  const circleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      circle.value,
      [0, 1],
      ["white", color]
    );

    return {
      opacity: opacitySwitch ? circle.value : 1, // Start at 1, decrease to 0.5
      transform: [
        {
          scale: Math.pow(2, interpolate(circle.value, [0, 1], [0, 5])), // Exponentially increase size
        },
      ],
      backgroundColor: backgroundColor, // Make the circle visible with a blue color
    };
  });
  useEffect(() => {
    circle.value = withDelay(
      delay,
      //   withRepeat(
      withTiming(1, {
        duration: 5000, //time circle animates
        easing: Easing.circle,
      })
      //     -1, //amt of times to repeat : -1 means infinite
      //     false //if we want it to reverse ( 0 -> 1 and then 1-> 0)
      //   )
    );
  }, []); // so it will only run once
  return <Animated.View style={[styles.circle, circleStyle]} />;
};

export default function CircleAnimation({ children }) {
  return (
    <View style={styles.container}>
      <View style={styles.whiteCircle}>
        <Text style={styles.text}>{children}</Text>
      </View>
      <Circle delay={0} color={avenuBlue} opacitySwitch={true} />
      <Circle delay={1000} color={avenuBlue} opacitySwitch={true} />
      <Circle delay={2000} color={avenuBlue} opacitySwitch={true} />
      <Circle delay={3000} color={avenuBlue} opacitySwitch={true} />
      <Circle delay={3500} color={"white"} opacitySwitch={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  circle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  whiteCircle: {
    position: "absolute",
    width: 80, // Size of the static white circle
    height: 80, // Size of the static white circle
    borderRadius: 40, // Half of the size to make it circular
    backgroundColor: "white", // White background to cover text area
    alignItems: "center", // Center the text horizontally
    justifyContent: "center", // Center the text vertically
    zIndex: 1, // Make sure it stays above the animated Circles
  },
});
