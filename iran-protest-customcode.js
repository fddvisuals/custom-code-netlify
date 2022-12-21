var transformRequest = (url, resourceType) => {
  var isMapboxRequest =
    url.slice(8, 22) === "api.mapbox.com" ||
    url.slice(10, 26) === "tiles.mapbox.com";
  return {
    url: isMapboxRequest ? url.replace("?", "?pluginName=sheetMapper&") : url,
  };
};

mapboxgl.accessToken =
  "pk.eyJ1IjoicGF2YWtwYXRlbCIsImEiOiJja3IwbnNqejUxdHpmMm5tbnFoa2tsNDcxIn0.Mi-o-UdZ0hTFy2iN7QBHrg";
var map = new mapboxgl.Map({
  container: "map", // container id
  style: "mapbox://styles/mapbox/navigation-day-v1",
  center: [51.4, 35.7], // starting position [lng, lat]
  zoom: 3, // starting zoom
  transformRequest: transformRequest,
});
$.ajax(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=412844906&range=a2&single=true&output=csv"
).done(function (injured) {
  document.getElementById("id_injured").innerHTML = injured;
});
$.ajax(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=412844906&range=c2&single=true&output=csv"
).done(function (arrested) {
  document.getElementById("id_arrested").innerHTML = arrested;
});
$.ajax(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=412844906&range=b2&single=true&output=csv"
).done(function (killed) {
  document.getElementById("id_killed").innerHTML = killed;
});
$.ajax(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=412844906&range=d2&single=true&output=csv"
).done(function (total_events) {
  document.getElementById("id_total").innerHTML = total_events;
});

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "https://docs.google.com/spreadsheets/d/1k9pmYP2UBYC7N5uIkXYy5UR4B15cFr1zpNSbCOg2BHo/gviz/tq?tqx=out:csv&sheet=Sheet1",
    dataType: "text",
    success: function (csvData) {
      makeGeoJSON(csvData);
    },
  });

  function makeGeoJSON(csvData) {
    csv2geojson.csv2geojson(
      csvData,
      {
        latfield: "Latitude",
        lonfield: "Longitude",
        delimiter: ",",
      },
      function (err, data) {
        map.on("load", function () {
          //Add the the layer to the map
          map.addLayer({
            id: "csvData",
            type: "circle",
            source: {
              type: "geojson",
              data: data,
            },
            paint: {
              "circle-radius": 5,
              "circle-color": "hsl(357, 78%, 73%)",
              "circle-opacity": 0.5,
              "circle-stroke-width": 0.75,
              "circle-stroke-color": "hsl(357, 78%, 51%)",
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                [
                  "*",
                  [
                    "match",
                    ["get", "Estimated_Size"],
                    "Unspecified",
                    3,
                    ["Small", "small"],
                    12,
                    "Medium",
                    15,
                    "Large",
                    21,
                    0,
                  ],
                  0.5,
                ],
                5,
                [
                  "*",
                  [
                    "match",
                    ["get", "Estimated_Size"],
                    "Unspecified",
                    3,
                    ["Small", "small"],
                    12,
                    "Medium",
                    15,
                    "Large",
                    21,
                    0,
                  ],
                  0.55,
                ],
                10,
                [
                  "*",
                  [
                    "match",
                    ["get", "Estimated_Size"],
                    "Unspecified",
                    3,
                    ["Small", "small"],
                    12,
                    "Medium",
                    15,
                    "Large",
                    21,
                    0,
                  ],
                  0.7,
                ],
                22,
                [
                  "*",
                  [
                    "match",
                    ["get", "Estimated_Size"],
                    "Unspecified",
                    3,
                    ["Small", "small"],
                    12,
                    "Medium",
                    15,
                    "Large",
                    21,
                    0,
                  ],
                  1,
                ],
              ],
            },
          });

          // When a click event occurs on a feature in the csvData layer, open a popup at the
          // location of the feature, with description HTML from its properties.
          map.on("click", "csvData", function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();

            //set popup text
            //You can adjust the values of the popup to match the headers of your CSV.
            // For example: e.features[0].properties.Name is retrieving information from the field Name in the original CSV.
            var description = `<h3>${e.features[0].properties.District}</h3><h5><u>Date: ${e.features[0].properties.Formatted_Date}</u></h5><h5><b>Description: </b>${e.features[0].properties.Description}</h5><h5><b>Estimated Size of the Protest: </b>${e.features[0].properties.Estimated_Size}</h4>`;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            //add Popup to map

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
          });

          // Change the cursor to a pointer when the mouse is over the places layer.
          map.on("mouseenter", "csvData", function () {
            map.getCanvas().style.cursor = "pointer";
          });

          // Change it back to a pointer when it leaves.
          map.on("mouseleave", "places", function () {
            map.getCanvas().style.cursor = "";
          });

          var bbox = turf.bbox(data);
          map.fitBounds(bbox, { padding: 50 });
        });
      }
    );
  }
});