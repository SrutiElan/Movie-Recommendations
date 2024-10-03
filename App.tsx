import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./app/screens/Home";
import GreetingScreen from "./app/screens/Greeting";
import SignUpScreen from "./app/screens/SignUp";
import LogInScreen from "./app/screens/LogIn";
import AddNewMovie from "./app/screens/AddNewMovie";

import { Provider } from "react-redux";
import { store } from "./app/store";
import { SafeAreaView } from "react-native";

export type RootStackParamList = {
  SignUp: undefined; // undefined because you aren't passing any params to the home screen
  Home: undefined;
  LogIn: undefined;
  AddNewMovie: undefined;
  Greeting: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }} // This hides the header
          ></Stack.Screen>
          <Stack.Screen
            name="LogIn"
            component={LogInScreen}
            options={{ headerShown: false }} // This hides the header
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }} // This hides the header
          />
          <Stack.Screen
            name="AddNewMovie"
            component={AddNewMovie}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Greeting"
            component={GreetingScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
