mapboxgl.accessToken =
  "pk.eyJ1IjoicGF2YWtwYXRlbCIsImEiOiJja3IwbnNqejUxdHpmMm5tbnFoa2tsNDcxIn0.Mi-o-UdZ0hTFy2iN7QBHrg";
const LAT = 34.314167;
const LONG = 47.065;
let map = new mapboxgl.Map({
  container: "map", // container id
  style: "mapbox://styles/pavakpatel/clajwj0vk000n14mlubuemyo2", // style URL
  projection: "mercator",
  pitch: "-10",
  center: [LONG, LAT], // starting position [lng, lat]
  zoom: 3, // starting zoom
});
// Add Circle Radius
const center = [LONG, LAT];
const radius = 200;
const options = {
  steps: 150,
  units: "kilometers",
};
const center2 = [LONG, LAT];
const radius2 = 500;
const options2 = {
  steps: 150,
  units: "kilometers",
};
const center3 = [LONG, LAT];
const radius3 = 1000;
const options3 = {
  steps: 150,
  units: "kilometers",
};
const center4 = [LONG, LAT];
const radius4 = 2000;
const options4 = {
  steps: 150,
  units: "kilometers",
};
const center5 = [LONG, LAT];
const radius5 = 10;
const options5 = {
  steps: 150,
  units: "kilometers",
};
const circle = turf.circle(center, radius, options);
const circle2 = turf.circle(center2, radius2, options2);
const circle3 = turf.circle(center3, radius3, options3);
const circle4 = turf.circle(center4, radius4, options4);
const circle5 = turf.circle(center5, radius5, options5);
map.on("load", function (e) {
  map.addSource("circleData", {
    type: "geojson",
    data: circle,
  });
  map.addSource("circleData2", {
    type: "geojson",
    data: circle2,
  });
  map.addSource("circleData3", {
    type: "geojson",
    data: circle3,
  });
  map.addSource("circleData4", {
    type: "geojson",
    data: circle4,
  });
  map.addSource("circleData5", {
    type: "geojson",
    data: circle5,
  });
  map.addLayer({
    id: "circle-fill",
    type: "fill",
    source: "circleData",
    paint: {
      "fill-color": "#79BC6F",
      "fill-opacity": 0.15,
    },
  });
  map.addLayer({
    id: "circle-stroke",
    type: "line",
    source: "circleData",
    paint: {
      "line-width": 2,
      "line-color": "#79BC6F",
      // "line-dasharray": [3, 3],
    },
  });
  map.addLayer({
    id: "circle-fill2",
    type: "fill",
    source: "circleData2",
    paint: {
      "fill-color": "#FEBE10",
      "fill-opacity": 0.05,
    },
  });
  map.addLayer({
    id: "circle-stroke2",
    type: "line",
    source: "circleData2",
    paint: {
      "line-width": 2,
      "line-color": "#FEBE10",
      // "line-dasharray": [3, 3],
    },
  });
  map.addLayer({
    id: "circle-fill3",
    type: "fill",
    source: "circleData3",
    paint: {
      "fill-color": "#FF7700",
      "fill-opacity": 0.05,
    },
  });
  map.addLayer({
    id: "circle-stroke3",
    type: "line",
    source: "circleData3",
    paint: {
      "line-width": 2,
      "line-color": "#FF7700",
      // "line-dasharray": [3, 3],
    },
  });
  map.addLayer({
    id: "circle-fill4",
    type: "fill",
    source: "circleData4",
    paint: {
      "fill-color": "#D2272D",
      "fill-opacity": 0.05,
    },
  });
  map.addLayer({
    id: "circle-stroke4",
    type: "line",
    source: "circleData4",
    paint: {
      "line-width": 2,
      "line-color": "#D2272D",
      // "line-dasharray": [3, 3],
    },
  });
  map.addLayer({
    id: "circle-fill5",
    type: "fill",
    source: "circleData5",
    paint: {
      "fill-color": "white",
      "fill-opacity": 0.05,
    },
  });
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  //Popup on Click
  map.on("click", "circle-fill", (e) => {
    const circlett = e.features[0];
    popup.setHTML("<b>300 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
  });
  //Popup on Hover
  map.on("mouseenter", "circle-fill", () => {
    map.getCanvas().style.cursor = "pointer";
    popup.setHTML("<b>Green: 300 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
  });
  map.on("mouseleave", "circle-fill", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
  map.on("click", "circle-fill2", () => {
    map.getCanvas().style.cursor = "pointer";
    popup.setHTML("<b>Yellow: 500 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
  });
  map.on("mouseleave", "circle-fill2", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
  map.on("mouseenter", "circle-fill3", () => {
    map.getCanvas().style.cursor = "pointer";
    popup.setHTML("<b>Orange: 1000 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
  });
  map.on("mouseleave", "circle-fill3", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
  map.on("mouseenter", "circle-fill4", () => {
    map.getCanvas().style.cursor = "pointer";
    popup.setHTML("<b>Red: 2000 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
  });
  map.on("mouseleave", "circle-fill4", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });

  //Set hover state on Outer HTML made in Webflow
  $(document).on("mouseenter", "#mb-2000", function (e) {
    //map.setFilter("circleData4");
    popup.setHTML("<b>Red: 2000 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
    map.removeLayer("circle-fill1");
    map.removeLayer("circle-fill2");
    map.removeLayer("circle-fill3");
  });
  $(document).on("mouseleave", "#mb-2000", function (e) {
    popup.remove();
  });

  $(document).on("mouseenter", "#mb-1000", function (e) {
    popup.setHTML("<b>Orange: 1000 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
  });
  $(document).on("mouseleave", "#mb-1000", function (e) {
    popup.remove();
  });

  $(document).on("mouseenter", "#mb-500", function (e) {
    popup.setHTML("<b>Yellow: 500 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
  });
  $(document).on("mouseleave", "#mb-500", function (e) {
    popup.remove();
  });

  $(document).on("mouseenter", "#mb-200", function (e) {
    popup.setHTML("<b>Green: 300 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
  });
  $(document).on("mouseleave", "#mb-200", function (e) {
    popup.remove();
  });
});
// Add marker
//   let marker = new mapboxgl.Marker({
//     draggable: false,
//   })
//     .setLngLat([LONG, LAT])
//     .addTo(map);