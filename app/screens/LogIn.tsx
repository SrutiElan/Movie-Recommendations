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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "LogIn">;
};

const LogIn: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const auth = getAuth();

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        //Signed in
        const user = userCredential.user;
        console.log(`Success logging ${email} in!`);
        navigation.navigate("Home");
        // setLoggedInUser(user.email);
      })
      .catch((error) => {
        setError(true);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error logging in: ", errorCode, errorMessage);
      });
  };

  useEffect(() => {
    if (error) {
      const time = setTimeout(() => setError(false), 3000);
      return () => {
        clearTimeout(time);
        setError(false);
        setEmail("");
        setPassword("");
      };
    }
  }, [error]);
  return (
    <View style={GlobalStyle.scrollViewContent}>
      <View style={GlobalStyle.container}>
        <Text style={GlobalStyle.titleText}>Log In</Text>
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
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
          />
          {/* need to hint what is wrong pwd or email not found*/}
          {error && (
            <Text
              style={[GlobalStyle.details, { color: "red", marginBottom: 10 }]}
            >
              There was an error logging you in.
            </Text>
          )}
          <TouchableOpacity style={GlobalStyle.button} onPress={() => login()}>
            <Text style={GlobalStyle.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text
              style={[
                GlobalStyle.buttonText,
                { alignSelf: "center", color: "gray", marginTop: `5%` },
              ]}
            >
              New? Sign Up Here!
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

export default LogIn;
