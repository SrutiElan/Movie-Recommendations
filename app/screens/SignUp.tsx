import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import GlobalStyle from "../styles/globals";

import "../../FirebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SignUp">;
};

const SignUp: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const auth = getAuth();

  const createUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate("Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(true);
        console.log("Error signing in:" + errorMessage); //add the specific codes later, like "auth/email-already-in-use"
      });
  };
  // useEffect(() => {
  //   if (error) {
  //     const time = setTimeout(() => setError(false), 3000);
  //     return () => {
  //       clearTimeout(time);
  //       setError(false);
  //       setEmail("");
  //       setPassword("");
  //     };
  //   }
  // }, [error]);
  return (
    <View style={GlobalStyle.scrollViewContent}>
      <View style={GlobalStyle.container}>
        <Text style={GlobalStyle.titleText}>Sign Up</Text>
        <View style={{ padding: 10 }}>
          <Text style={[GlobalStyle.details, { fontSize: 13 }]}>Email</Text>

          <TextInput
            style={GlobalStyle.textInput}
            onChangeText={setEmail}
            value={email}
            placeholder="abcd@email.com"
          />
          <Text style={[GlobalStyle.details, { fontSize: 13 }]}>Password</Text>
          <TextInput
            style={GlobalStyle.textInput}
            onChangeText={(text: string) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            //passwordRules={"required: upper; required: lower; minlength: 8;"}
          />
          {error && (
            <Text
              style={[GlobalStyle.details, { color: "red", marginBottom: 10 }]}
            >
              There was an error signing you up.
            </Text>
          )}
          <TouchableOpacity
            style={GlobalStyle.button}
            onPress={() => createUser()}
          >
            <Text style={GlobalStyle.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
            <Text
              style={[
                GlobalStyle.buttonText,
                { alignSelf: "center", color: "gray", marginTop: `5%` },
              ]}
            >
              Already have an account? Log in!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default SignUp;
