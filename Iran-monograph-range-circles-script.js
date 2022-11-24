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
  zoom: 2, // starting zoom
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

  //Circle Fill Layers
  map.addLayer({
    id: "circle-fill5",
    type: "fill",
    source: "circleData5",
    paint: {
      "fill-color": "white",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.5,
        0,
      ],
    },
  });
  map.addLayer({
    id: "circle-fill4",
    type: "fill",
    source: "circleData4",
    paint: {
      "fill-color": "#D2272D",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.5,
        0,
      ],
    },
  });
  map.addLayer({
    id: "circle-fill3",
    type: "fill",
    source: "circleData3",
    paint: {
      "fill-color": "#FF7700",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.5,
        0,
      ],
    },
  });
  map.addLayer({
    id: "circle-fill2",
    type: "fill",
    source: "circleData2",
    paint: {
      "fill-color": "#FEBE10",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.5,
        0,
      ],
    },
  });
  map.addLayer({
    id: "circle-fill",
    type: "fill",
    source: "circleData",
    paint: {
      "fill-color": "#79BC6F",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.5,
        0,
      ],
    },
  });

  //Circle Stroke Layers
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
    id: "circle-stroke4",
    type: "line",
    source: "circleData4",
    paint: {
      "line-width": 2,
      "line-color": "#D2272D",
      // "line-dasharray": [3, 3],
    },
  });

  //Popup
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  //Popup on Click
  // map.on("click", "circle-fill", (e) => {
  //   const circlett = e.features[0];
  //   popup.setHTML("<b>300 KM</b>");
  //   popup.setLngLat([LONG, LAT]);
  //   popup.addTo(map);
  // });

  //Popup on Hover
  map.on("mouseenter", "circle-fill", () => {
    map.getCanvas().style.cursor = "pointer";
    popup.setHTML("<b> 200 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
    map.setFeatureState(
      { source: "circleData", id: "circle-fill" },
      { hover: true }
    );
    $(function () {
      var target = $("#mb-200");
      if (target.length) {
        $("html,.missile-wrapper").animate(
          {
            scrollTop: target.offset().top + 10,
          },
          0
        );
        return false;
      }
    });
  });
  map.on("mouseleave", "circle-fill", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
  map.on("mouseenter", "circle-fill2", () => {
    map.getCanvas().style.cursor = "pointer";
    popup.setHTML("<b>500 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
    var target = $("#mb-500");
    if (target.length) {
      $("html,.missile-wrapper").animate(
        {
          scrollTop: target.offset().top,
        },
        0
      );
      return false;
    }
  });
  map.on("mouseleave", "circle-fill2", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
  map.on("mouseenter", "circle-fill3", () => {
    map.getCanvas().style.cursor = "pointer";
    popup.setHTML("<b>1000 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
    var target = $("#mb-1000");
    if (target.length) {
      $("html,.missile-wrapper").animate(
        {
          scrollTop: target.offset().top,
        },
        0
      );
      return false;
    }
  });
  map.on("mouseleave", "circle-fill3", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
  map.on("mouseenter", "circle-fill4", () => {
    map.getCanvas().style.cursor = "pointer";
    popup.setHTML("<b>2000 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
    var target = $("#mb-2000");
    if (target.length) {
      $("html,.missile-wrapper").animate(
        {
          scrollTop: target.offset().top +300,
        },
        0
      );
      return false;
    }
  });
  map.on("mouseleave", "circle-fill4", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });

  //Set hover state on Outer HTML made in Webflow
  $(document).on("mouseenter", "#mb-2000", function (e) {
    //map.setFilter("circleData4");
    popup.setHTML("<b>2000 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
    cf1 = "circle-fill";
    cs1 = "circle-stroke";
    cf2 = "circle-fill2";
    cs2 = "circle-stroke2";
    cf3 = "circle-fill3";
    cs3 = "circle-stroke3";
    map.removeLayer(cf1);
    map.removeLayer(cs1);
    map.removeLayer(cf2);
    map.removeLayer(cs2);
    map.removeLayer(cf3);
    map.removeLayer(cs3);
  });
  $(document).on("mouseleave", "#mb-2000", function (e) {
    popup.remove();
    map.addLayer({
      id: "circle-fill",
      type: "fill",
      source: "circleData",
      paint: {
        "fill-color": "#79BC6F",
        "fill-opacity": 0,
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
        "fill-opacity": 0,
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
        "fill-opacity": 0,
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
  });

  $(document).on("mouseenter", "#mb-1000", function (e) {
    popup.setHTML("<b>1000 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
    cf1 = "circle-fill";
    cs1 = "circle-stroke";
    cf2 = "circle-fill2";
    cs2 = "circle-stroke2";
    cf4 = "circle-fill4";
    cs4 = "circle-stroke4";
    map.removeLayer(cf1);
    map.removeLayer(cs1);
    map.removeLayer(cf2);
    map.removeLayer(cs2);
    map.removeLayer(cf4);
    map.removeLayer(cs4);
  });
  $(document).on("mouseleave", "#mb-1000", function (e) {
    popup.remove();
    map.addLayer({
      id: "circle-fill",
      type: "fill",
      source: "circleData",
      paint: {
        "fill-color": "#79BC6F",
        "fill-opacity": 0,
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
        "fill-opacity": 0,
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
      id: "circle-fill4",
      type: "fill",
      source: "circleData4",
      paint: {
        "fill-color": "#D2272D",
        "fill-opacity": 0,
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
  });

  $(document).on("mouseenter", "#mb-500", function (e) {
    popup.setHTML("<b>500 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
    cf1 = "circle-fill";
    cs1 = "circle-stroke";
    cf3 = "circle-fill3";
    cs3 = "circle-stroke3";
    cf4 = "circle-fill4";
    cs4 = "circle-stroke4";
    map.removeLayer(cf1);
    map.removeLayer(cs1);
    map.removeLayer(cf4);
    map.removeLayer(cs4);
    map.removeLayer(cf3);
    map.removeLayer(cs3);
  });
  $(document).on("mouseleave", "#mb-500", function (e) {
    popup.remove();
    map.addLayer({
      id: "circle-fill",
      type: "fill",
      source: "circleData",
      paint: {
        "fill-color": "#79BC6F",
        "fill-opacity": 0,
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
      id: "circle-fill3",
      type: "fill",
      source: "circleData3",
      paint: {
        "fill-color": "#FF7700",
        "fill-opacity": 0,
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
        "fill-opacity": 0,
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
  });

  $(document).on("mouseenter", "#mb-200", function (e) {
    popup.setHTML("<b> 200 KM</b>");
    popup.setLngLat([LONG, LAT]);
    popup.addTo(map);
    cf2 = "circle-fill2";
    cs2 = "circle-stroke2";
    cf3 = "circle-fill3";
    cs3 = "circle-stroke3";
    cf4 = "circle-fill4";
    cs4 = "circle-stroke4";
    map.removeLayer(cf2);
    map.removeLayer(cs2);
    map.removeLayer(cf4);
    map.removeLayer(cs4);
    map.removeLayer(cf3);
    map.removeLayer(cs3);
  });
  $(document).on("mouseleave", "#mb-200", function (e) {
    popup.remove();
    map.addLayer({
      id: "circle-fill2",
      type: "fill",
      source: "circleData2",
      paint: {
        "fill-color": "#FEBE10",
        "fill-opacity": 0,
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
        "fill-opacity": 0,
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
        "fill-opacity": 0,
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
  });
});
// Add marker
//   let marker = new mapboxgl.Marker({
//     draggable: false,
//   })
//     .setLngLat([LONG, LAT])
//     .addTo(map);
