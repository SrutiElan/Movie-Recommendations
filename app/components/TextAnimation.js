import { delay } from "lodash";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";

export default TextAnimation = (props) => {
  const animatedValues = [];
  const textArr = props.content.trim().split(" "); // splits text at every space (so word)

  textArr.forEach((_, i) => {
    animatedValues[i] = new Animated.Value(0); // assigns each word an animated value of 0
  });

  useEffect(() => {
    animate();
  }); 
  const animate = (toValue = 1) => {
    const animations = textArr.map((_, i) => {
      return Animated.timing(animatedValues[i], {
        toValue,
        duration: props.duration / textArr.length, // each word has an equal duration of fading in
        useNativeDriver: true,
      });
    });

    // const staggerAnimation = toValue === 0 
    //   ? animations.reverse()  // Reverse the order for fade-out
    //   : animations;  // Default order for fade-in

    Animated.stagger(100, animations).start(() => {
      if (toValue === 0 && props.onFinish) {
        setTimeout(() => {
          props.onFinish();
        }, props.duration / textArr.length);
      } else {
        setTimeout(() => animate(0), props.duration / 2); // Trigger fade-out
      }
    });
  };

  return (
    <View style={styles.textWrapper}>
      {textArr.map((word, index) => {
        if (word === "\n") {
          return <Text key={`line-break-${index}`} style={styles.lineBreak} />;
        }
        return (
          <Animated.Text
            key={`${word}-${index}`}
            style={[
              props.textStyle,
              {
                opacity: animatedValues[index], // fade
                transform: [
                  {
                    translateY: Animated.multiply(animatedValues[index], new Animated.Value(-2)), // popping up
                  },
                ],
              },
            ]}
          >
            {word}
            {`${index < textArr.length ? " " : ""}`}
          </Animated.Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  lineBreak: {
    flexBasis: "100%",
    height: 0, // This allows the line break to act as a new line
  },
});
