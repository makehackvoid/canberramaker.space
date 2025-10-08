import { createSignal, onMount } from "solid-js";

import MapGL, { Source, Layer, Marker } from "solid-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import "./Map.css";

export default (props) => {
  const [viewport, setViewport] = createSignal({
    center: [149.09658626453248, -35.21662885760703],
    zoom: 15,
  });

  const [config, setConfig] = createSignal({});

  const getPreferredScheme = () =>
    window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches
      ? "dark"
      : "light";

  onMount(() => {
    let style = "mapbox://styles/mapbox/outdoors-v11";
    if (getPreferredScheme() == "dark") {
      style = "mapbox://styles/mapbox/navigation-night-v1";
    }

    console.log(style);
    setConfig({
      style: style,
      scrollZoom: props.scrollZoom,
      accessToken:
        "pk.eyJ1IjoiY2FuYmVycmFtYWtlcnNwYWNlIiwiYSI6ImNseWZseWFzODAwdTkybXEwODBkYmJuczQifQ.2nQtiwY29DgMP6aZvEhisA",
    });
  });

  return (
    <>
      <MapGL
        options={config()}
        viewport={viewport()}
        onViewportChange={(evt) => setViewport(evt)}
      >
        <Marker
          lngLat={[149.09658626453248, -35.21662885760703]}
          options={{ color: "#F00" }}
        >
          Hi there! 👋
        </Marker>
      </MapGL>
    </>
  );
};
