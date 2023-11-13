import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const SIZE = 90;
const CIRCLE_RADIUS = SIZE * 2;

function App() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateY.value;
      context.translateX = translateX.value;
      context.startRotation = rotation.value;
    },
    onActive: (event, context) => {
      const dx = event.translationX;
      const dy = event.translationY;

      // Calculate the angle of the drag gesture
      const angle = Math.atan2(dy, dx);

      // Update the rotation based on the angle
      rotation.value = context.startRotation + angle;
    },
    onEnd: () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      rotation.value = withSpring(0);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // { translateX: translateX.value },
        { rotate: `${rotation.value}rad` }, // Apply rotation
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.square, rStyle]}>
            <Image
              source={require("./assets/steering.png")}
              style={{ height: "100%", width: "100%", borderRadius: 200 }}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: "90%",
    height: "90%",

    borderRadius: 200,

    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: CIRCLE_RADIUS,
    // borderWidth: 5,
  },
});
