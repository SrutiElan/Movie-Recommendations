import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
const AuthCheck = () => {
  const navigate = useNavigation();
  useEffect(() => {});
};
