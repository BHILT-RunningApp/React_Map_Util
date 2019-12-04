import React, { Component } from "react";

import { Map, TileLayer, Marker } from "react-leaflet";

import { getRoute } from "./api";
import AddMarker from "./Marker";
import Line from "./Line";
import L from "leaflet";

import { Rectangle } from "react-leaflet";
import RoutingMachine from "./Routing";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import HeatmapLayer from "react-leaflet-heatmap-layer/";
import { addressPoints } from "react-leaflet-heatmap-layer";

class RouteMap extends Component {
  state = {
    defaultCenter: {
      lat: 53.47,
      lng: -2.24,
      zoom: 13
    },
    markers: [{ position: { latitude: 53.47, longitude: -2.24 } }],
    road: [
      L.latLng(53.4699512, -2.2401617),
      L.latLng(53.4694076, -2.2396982),
      L.latLng(53.4679484, -2.2396982)
    ],
    // avoidZone: [{topLeftLat:53.44,topLeftLong:-2.26}],
    rectangle: [
      [53.447967, -2.260778],
      [53.443699, -2.25168]
    ],
    isLoading: true
  };

  fetchRoute = (startCoordinates, endCoordinates, avoidAreas) => {
    // console.log(avoidAreas);
    getRoute(startCoordinates, endCoordinates, avoidAreas).then(({ data }) => {
      // console.log(data.response.route[0].leg[0].maneuver);
      const roadArr = [];
      const str = "";
      data.response.route[0].leg[0].maneuver.forEach(point => {
        roadArr.push(
          L.latLng(point.position.latitude, point.position.longitude)
        );
        // str += point.position.latitude + point.position.longitude;
      });
      this.setState({ road: roadArr, isLoading: false });
    });
  };

  componentDidMount = () => {
    // console.log(
    //   `${this.state.rectangle[0][0]},${this.state.rectangle[0][1]};${this.state.rectangle[1][0]},${this.state.rectangle[1][1]}!`
    // );
    this.fetchRoute(
      "53.47,-2.24",
      "53.44,-2.26",
      `${this.state.rectangle[0][0]},${this.state.rectangle[0][1]};${this.state.rectangle[1][0]},${this.state.rectangle[1][1]}`
    );
  };

  road = [L.latLng(53.447967, -2.260778), L.latLng(53.443699, -2.25168)];
  map = React.createRef();
  defaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
  });

  render() {
    let centerPosition = this.state.defaultCenter;

    return (
      <Map
        center={centerPosition}
        zoom={this.state.defaultCenter.zoom}
        ref={this.map}
      >
        <HeatmapLayer
          fitBoundsOnLoad
          fitBoundsOnUpdate
          points={addressPoints}
          longitudeExtractor={m => {
            console.log(m);
            return m[1];
          }}
          latitudeExtractor={m => m[0]}
          intensityExtractor={m => parseFloat(m[2])}
        />
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {!this.state.isLoading && (
          <div>
            <Rectangle bounds={this.state.rectangle} color="red" />
            <AddMarker data={this.state.road} />
            {/* {this.state.road.map((point, index) => (
              // <Marker key={index} position={point} />
            ))} */}
            <RoutingMachine
              color="#000"
              road={this.state.road}
              map={this.map}
            />
          </div>
        )}

        {/* <Routing map={this.refs.map} /> */}
        {/* <Line data={this.state.markers} /> */}
      </Map>
    );
  }
}

// L.latLng(53.4699512, -2.2401617),
//         L.latLng(53.4694076, -2.2396982)

export default RouteMap;
