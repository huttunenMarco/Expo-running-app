import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  TouchableHighlight
} from "react-native";
import { MapView, Location } from "expo";
import Info from "./Info";
import Pin from "./Pin";
const { Polyline, Marker } = MapView;
import * as turf from "@turf/turf";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: 0,
      positions: [],
      pace: 0,
      modalVisible: false,
      showCountDown: false,
      countDown: 3
    };
  }

  async componentDidMount() {
    this.watcher = await Location.watchPositionAsync(
      { enableHightAccuracy: true, timeInterval: 1000, distanceInterval: 1 },
      p => this.newPosition(p)
    );
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  restart() {
    this.setState({
      showCountDown: true
    });

    this.interval = setInterval(() => {
      if (this.state.countDown <= 1) {
        clearInterval(this.interval);
        this.setState({
          countDown: 3,
          distance: 0,
          positions: [this.state.positions[this.state.positions.length - 1]],
          pace: 0,
          modalVisible: false,
          showCountDown: false
        });
      }
      this.setState({ countDown: this.state.countDown - 1 });
    }, 1000);
  }

  doneRunning() {
    this.setState({
      countDown: 3,
      distance: 0,
      positions: [],
      pace: 0,
      modalVisible: false,
      showCountDown: false
    });
  }
  paceBetween(distance, from, to) {
    const pace = (to.timestamp - from.timestamp) / distance;
    return pace || 0;
  }
  distanceBetween(from, to) {
    const origin = turf.point([from.coords.longitude, from.coords.latitude]);
    const destination = turf.point([to.coords.longitude, to.coords.latitude]);
    return turf.distance(origin, destination, { units: "meters" });
  }
  newPosition(position) {
    const { positions } = this.state;
    const { distance: totalDistance } = this.props;
    const duration = positions.length
      ? position.timestamp - positions[0].timestamp
      : 0;
    const distance = positions.length
      ? this.distanceBetween(positions[positions.length - 1], position)
      : 0;

    const pace = positions.length
      ? this.paceBetween(distance, positions[positions.length - 1], position)
      : 0;

    this.setState(
      {
        positions: [...positions, position],
        duration,
        pace,
        distance: this.state.distance + distance
      },
      () => {
        if (this.props.distance - Math.round(this.state.distance) <= 0) {
          this.setState({
            modalVisible: true
          });
        }
      }
    );
  }

  render() {
    const { positions, distance, pace } = this.state;
    const { latitude, longitude, distance: totalDistance } = this.props;
    const currentPosition = positions.length
      ? positions[positions.length - 1]
      : { coords: { latitude, longitude } };

    const region = {
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.01
    };

    console.log(
      "positions",
      positions.length ? positions.map(p => p.coords) : [currentPosition.coords]
    );

    return (
      <View style={styles.container}>
        {!this.state.modalVisible && (
          <Info
            {...{
              distance,
              totalDistance,
              pace
            }}
          />
        )}

        <Modal animationType="slide" visible={this.state.modalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {!this.state.showCountDown ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.header}>Good job!</Text>

                <TouchableHighlight
                  style={styles.button}
                  onPress={() => {
                    this.restart();
                  }}
                >
                  <Text>Run again</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.buttonCancel}
                  onPress={() => {
                    this.doneRunning();
                  }}
                >
                  <Text style={{ color: "white" }}>Nah, im done.</Text>
                </TouchableHighlight>
              </View>
            ) : (
              <View>
                <Text style={styles.header}>{this.state.countDown}</Text>
              </View>
            )}
          </View>
        </Modal>

        <MapView
          style={styles.map}
          initialRegion={region}
          region={region}
          provider="google"
        >
          <Marker
            coordinate={currentPosition.coords}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Pin />
          </Marker>
          {!this.state.modalVisible && (
            <Polyline
              coordinates={
                positions.length
                  ? positions.map(p => p.coords)
                  : [currentPosition.coords]
              }
              strokeWidth={5}
              strokeColor="#303030"
            />
          )}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1,
    width: Dimensions.get("window").width
  },
  info: {
    flex: 0.5,
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 50
  },
  buttonCancel: {
    width: 120,
    backgroundColor: "black",
    margin: 5,
    marginTop: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3
  },
  button: {
    width: 150,
    backgroundColor: "white",
    height: 50,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    borderWidth: 1
  }
});
