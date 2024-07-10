import { createSignal, onMount } from 'solid-js';

import MapGL, { Source, Layer, Marker } from "solid-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

import './Map.css';

export default (props) => {
  const [viewport, setViewport] = createSignal({
    center: [149.09658626453248, -35.21662885760703],
    zoom: 15,
  });

  return (
    <>
      <MapGL
        options={{ style: "mapbox://styles/mapbox/outdoors-v11", accessToken: "pk.eyJ1IjoiamFtZXN3aWxtb3QiLCJhIjoiY2x5ZTQ1MnpiMGRoNjJrcHYxZzB3MjM5MCJ9.WEI3PEtucKnNpV-kZtnqgw" }}
        viewport={viewport()}
        onViewportChange={(evt) => setViewport(evt)}
      >
        <Marker lngLat={
            [149.09658626453248, -35.21662885760703]
        } options={{ color: '#F00' }}>
            Hi there! 👋
          </Marker>
      </MapGL>
    </>
  );
}
