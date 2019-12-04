import { MapLayer } from "react-leaflet";
import L from "leaflet";
import { withLeaflet } from "react-leaflet";
import "leaflet-routing-machine/src";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

class RoutingMachine extends MapLayer {
  createLeafletElement() {
    const { color, map, road } = this.props;

    let leafletElement = L.Routing.control({
      waypoints: road,
      lineOptions: {
        styles: [
          {
            color,
            opacity: 0.8,
            weight: 6
          }
        ]
      },
      addWaypoints: true,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
      altLineOptions: { styles: [{ opacity: 0 }] },
      createMarker: () => {
        return null;
      },
      vehicle: "walking",
      router: L.Routing.mapbox(
        "pk.eyJ1IjoiaGFycnlwZnJ5IiwiYSI6ImNrM3EwYTVmYjA4Mzgzbm1vd2h0NjRobDgifQ.ZrK9wTTyKg6YpwI2KGC9bQ",
        { profile: "mapbox/walking" }
      )
    }).addTo(map.current.leafletElement);

    leafletElement.hide(); // hide road describtion
    return leafletElement.getPlan();
  }
}

export default withLeaflet(RoutingMachine);

// export default RoutingMachine;
// waypoints: [
//     L.latLng(53.4699512, -2.2401617),
//     L.latLng(53.4694076, -2.2396982)
//   ],
