import { Polyline } from "react-leaflet";

import React, { Component } from "react";

class Line extends Component {
  state = { data: [], lineData: [] };

  formatLineData = ({ data }) => {
    // console.log(data.length);
    if (data.length < 2) return [];
    const outputArr = [];
    for (let i = 0; i < data.length - 1; i++) {
      //   console.log(data[i].position.latitude);
      outputArr.push({
        fromLat: data[i].position.latitude,
        fromLong: data[i].position.longitude,
        toLat: data[i + 1].position.latitude,
        toLong: data[i + 1].position.longitude
      });
    }
    return outputArr;
  };

  componentDidUpdate = () => {
    // console.log(this.formatLineData(this.props));
    // this.setState(this.formatLineData(this.props));
  };

  render() {
    const lineData = this.formatLineData(this.props);

    return lineData.map(({ fromLat, fromLong, toLat, toLong }, index) => {
      return (
        <Polyline
          key={index}
          positions={[
            [fromLat, fromLong],
            [toLat, toLong]
          ]}
        />
      );
    });
  }
}

export default Line;
