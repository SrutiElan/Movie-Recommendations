import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";

export default AnimatedView = (props) => {
  animatedValues = [];
  const textArr = props.content.trim().split(" ");

  textArr.forEach((_, i) => {
    animatedValues[i] = new Animated.Value(0);
  });

  useEffect(() => {
    animate();
  });
  const animate = (toValue = 1) => {
    const animations = textArr.map((_, i) => {
      return Animated.timing(this.animatedValues[i], {
        toValue,
        duration: props.duration,
        useNativeDriver: true,
      });
    });
    Animated.stagger(
      props.duration / 5,
      toValue === 0 ? animations.reverse() : animations
    ).start(() => {
      if (toValue === 0 && props.onFinish) {
        props.onFinish();
      } else {
        setTimeout(() => animate(toValue === 0 ? 1 : 0), 1000);
      }
    });
  };

  return (
    <View style={styles.textWrapper}>
      {textArr.map((word, index) => {
        return (
          <Animated.Text
            key={`${word}-${index}`}
            style={[
              props.textStyle,
              {
                opacity: animatedValues[index],
                transform: [
                  {
                    translateY: Animated.multiply(
                      animatedValues[index],
                      new Animated.Value(-2)
                    ),
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
});
