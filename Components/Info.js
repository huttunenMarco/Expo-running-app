import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { MapView, Location } from "expo";
const { Polyline, Marker } = MapView;
import moment from "moment";
import * as turf from "@turf/turf";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 0
    };
  }

  componentDidMount() {
    this.interval = setInterval(
      () => this.setState({ duration: this.state.duration + 1 }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  formatDuration(duration) {
    return moment
      .utc(moment.duration(duration, "s").asMilliseconds())
      .format("mm:ss");
  }

  render() {
    const { distance, pace, totalDistance } = this.props;
    const { duration } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text>Meters left:</Text>
          <Text style={styles.distance}>
            {totalDistance - Math.round(distance)}
          </Text>

          <Text>{this.formatDuration(duration)}</Text>
          <Text>{this.formatDuration(pace)}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.4
  },

  info: {
    flex: 1,
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center"
  },
  distance: {
    fontSize: 72
  }
});
