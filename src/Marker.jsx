import React from "react";

import { Marker } from "react-leaflet";

function AddMarker({ data }) {
  return data.map((point, index) => {
    return <Marker key={index} position={[point.lat, point.lng]} />;
  });
}

export default AddMarker;
