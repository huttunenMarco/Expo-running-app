import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.outerPin}>
        <View style={styles.innerPin}>
          <View style={styles.innerInnerPin} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  outerPin: {
    height: 30,
    width: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    opacity: 0.8
  },
  innerPin: {
    height: 15,
    width: 15,
    borderRadius: 25,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  innerInnerPin: {
    height: 5,
    width: 5,
    borderRadius: 25,
    backgroundColor: "white"
  }
});
