import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Permissions, Location } from "expo";
import Run from "./Components/Run";

export default class App extends React.Component {
  state = {
    longitude: 0,
    latitude: 0,
    distance: 200
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.setState({ longitude, latitude, granted: true });
    } else {
      this.setState({ granted: false });
    }
  }

  render() {
    const { longitude, latitude, granted } = this.state;

    return (
      <View style={styles.container}>
        {granted && longitude && latitude ? (
          <Run distance={200} {...{ longitude, latitude }} />
        ) : (
          <Text>Cant find your position</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
