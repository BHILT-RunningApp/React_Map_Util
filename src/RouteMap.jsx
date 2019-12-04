import React, { Component } from "react";

import { Map, TileLayer } from "react-leaflet";

import { getRoute } from "./api";
import AddMarker from "./Marker";
import L from "leaflet";

import RoutingMachine from "./Routing";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import HeatmapLayer from "react-leaflet-heatmap-layer";

class RouteMap extends Component {
  state = {
    defaultCenter: {
      lat: 53.447967,
      lng: -2.260778
    },
    markers: [{ position: { latitude: 53.47, longitude: -2.24 } }],
    road: [
      L.latLng(53.4699512, -2.2401617),
      L.latLng(53.4694076, -2.2396982),
      L.latLng(53.4679484, -2.2396982)
    ],
    rectangle: [
      [53.447967, -2.260778],
      [53.443699, -2.25168]
    ],
    isLoading: true,
    avoidAreaToggle: true,
    radius: 64,
    blur: 8,
    max: 0.5,
    zoom: 14,
    leafletElement: null
  };

  fetchRoute = (startCoordinates, endCoordinates, avoidAreas) => {
    getRoute(startCoordinates, endCoordinates, avoidAreas).then(({ data }) => {
      const roadArr = [];
      data.response.route[0].leg[0].maneuver.forEach(point => {
        roadArr.push(
          L.latLng(point.position.latitude, point.position.longitude)
        );
      });
      this.setState({ road: roadArr, isLoading: false });
    });
  };

  componentDidMount = () => {
    if (this.state.avoidAreaToggle) {
      this.fetchRoute(
        "53.47,-2.24",
        "53.44,-2.26",
        `${this.state.rectangle[0][0]},${this.state.rectangle[0][1]};${this.state.rectangle[1][0]},${this.state.rectangle[1][1]}`
      );
    } else {
      this.fetchRoute("53.47,-2.24", "53.44,-2.26");
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.avoidAreaToggle !== this.state.avoidAreaToggle) {
      if (this.state.avoidAreaToggle) {
        this.fetchRoute(
          "53.47,-2.24",
          "53.44,-2.26",
          `${this.state.rectangle[0][0]},${this.state.rectangle[0][1]};${this.state.rectangle[1][0]},${this.state.rectangle[1][1]}`
        );
      } else {
        this.fetchRoute("53.47,-2.24", "53.44,-2.26");
      }
    }
  };

  road = [L.latLng(53.447967, -2.260778), L.latLng(53.443699, -2.25168)];

  map = React.createRef();
  defaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
  });

  handleZoom = event => {
    this.setState(previousState => {
      return { zoom: event.target._zoom };
    });
  };

  handleCheck = event => {
    this.setState(previousState => {
      return {
        isLoading: true,
        avoidAreaToggle: !previousState.avoidAreaToggle
      };
    });
  };

  render() {
    let centerPosition = this.state.defaultCenter;

    const gradient = {
      0.1: "#89BDE0",
      0.2: "#96E3E6",
      0.4: "#82CEB6",
      0.6: "#FAF3A5",
      0.8: "#F5D98B",
      "1.0": "#DE9A96"
    };

    const addressPoints = [
      [
        (this.state.rectangle[0][0] + this.state.rectangle[1][0]) / 2,
        (this.state.rectangle[0][1] + this.state.rectangle[1][1]) / 2,
        "3000"
      ],
      [0, 0, "0"]
    ];

    return (
      !this.state.isLoading && (
        <>
          <Map
            center={centerPosition}
            zoom={this.state.zoom}
            ref={this.map}
            onZoom={this.handleZoom}
          >
            {this.state.avoidAreaToggle && (
              <HeatmapLayer
                // fitBoundsOnLoad
                // fitBoundsOnUpdate
                points={addressPoints}
                longitudeExtractor={m => m[1]}
                latitudeExtractor={m => m[0]}
                gradient={gradient}
                intensityExtractor={m => parseFloat(m[2])}
                radius={this.state.radius}
                blur={50}
                max={5}
              />
            )}
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {!this.state.isLoading && (
              <div>
                <AddMarker data={this.state.road} />

                <RoutingMachine
                  color="#000"
                  road={this.state.road}
                  map={this.map}
                />
              </div>
            )}
          </Map>
          <form id="toggle">
            <label>
              <input
                name="toggle-pollution"
                type="checkbox"
                checked={this.state.avoidAreaToggle}
                onChange={this.handleCheck}
              />
              Toggle Pollution
            </label>
          </form>
        </>
      )
    );
  }
}

export default RouteMap;
