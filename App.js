import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { modelURI } from "./src/modelHandler";
import CameraView from "./src/CameraView";

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState("back");
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [inputTensor, setInputTensor] = useState([]);

  // model configuration
  const configurations = { threshold: 0.25 };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      tf.ready().then(async () => {
        const yolov5 = await tf.loadGraphModel(modelURI, {
          onProgress: (fractions) => {
            setLoading({ loading: true, progress: fractions }); // set loading fractions
          },
        }); // load model

        // warming up model
        const dummyInput = tf.ones(yolov5.inputs[0].shape);
        await yolov5.executeAsync(dummyInput);
        tf.dispose(dummyInput);

        // set state
        setInputTensor(yolov5.inputs[0].shape);
        setModel(yolov5);
        setLoading({ loading: false, progress: 1 });
      });
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      {hasPermission ? (
        <>
          {loading.loading ? (
            <Text style={{ fontSize: 20 }}>
              Loading model... {`${(loading.progress * 100).toFixed(2)}%`}
            </Text>
          ) : (
            <View style={{ flex: 1, width: "100%", height: "100%" }}>
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CameraView
                  type={type}
                  model={model}
                  inputTensorSize={inputTensor}
                  config={configurations}
                >
                  {/* <View
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                      flex: 1,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      backgroundColor: "transparent",
                      zIndex: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderColor: "white",
                        padding: 3,
                        marginBottom: 10,
                        borderRadius: 10,
                      }}
                      onPress={() =>
                        setType((current) =>
                          current === "back" ? "front" : "back"
                        )
                      }
                    >
                      <MaterialCommunityIcons
                        style={{ marginHorizontal: 2 }}
                        name="camera-flip"
                        size={30}
                        color="white"
                      />
                      <Text
                        style={{
                          marginHorizontal: 2,
                          color: "white",
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                      >
                        Flip Camera
                      </Text>
                    </TouchableOpacity>
                  </View> */}
                </CameraView>
              </View>
            </View>
          )}
        </>
      ) : (
        <View>
          <Text style={{ fontSize: 20 }}>Permission not granted!</Text>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
