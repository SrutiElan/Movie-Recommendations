import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollViewContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    height: `100%`,
    width: `100%`,
  },
  container: {
    justifyContent: "flex-start",
    marginVertical: 80,
    marginHorizontal: "10%",
    height: `80%`,
    width: `80%`,
  },
  titleText: {
    fontFamily: "Inter-Bold",
    alignSelf: "baseline",
    fontSize: 25,
    color: "#000000",
    padding: 10,
  },
  labelText: {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 7,
    letterSpacing: 0.4,
    opacity: 0.32,
    marginVertical: 3,
  },
  details: {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 10,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#024023",
    borderRadius: 12,
    width: `100%`,
    alignItems: "center",
    height: "auto",
  },
  buttonOutline: {
    borderRadius: 12,
    borderColor: "#C6C6C8",
    borderWidth: 1,
    width: `100%`,
    alignItems: "center",
    height: "auto",
  },
  buttonText: {
    fontWeight: 400,
    fontSize: 12,
    color: "#F5F5F5",
    margin: 3,
  },
  textInput: {
    height: 25,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: "auto",
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
  },
});
