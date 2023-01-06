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
  style: "mapbox://styles/mapbox/light-v11",
  center: [40.44, 29.5], // starting position [lng, lat]
  zoom: 4.1, // starting zoom
  cluster: true,
  clusterMaxZoom: 14, // Max zoom to cluster points on
  clusterRadius: 30, // Radius of each cluster when clustering points (defaults to 50)
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
  // document.getElementById("id-total-text").innerHTML = total_events;
});
$.ajax(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=412844906&range=d2&single=true&output=csv"
).done(function (total_events) {
  // document.getElementById("id_total").innerHTML = total_events;
  document.getElementById("id-total-text").innerHTML = total_events;
});
$.ajax(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=412844906&range=e2&single=true&output=csv"
).done(function (lastupdated) {
  var last_updated_noquote = lastupdated;
  document.getElementById("last-updated").innerHTML = last_updated_noquote.replace(/['"]+/g,'');
});
$.ajax(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=412844906&range=e2&single=true&output=csv"
).done(function (lastupdated) {
  document.getElementById("last-updated-mobile").innerHTML = lastupdated;
});

map.on("load", function () {
  Papa.parse(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=0&single=true&output=csv",
    {
      download: true,
      header: true,
      complete: function (csvData) {
        makeGeoJSON(csvData.data);
        addRecent(csvData.data);
        addRecentmobile(csvData.data);
      },
    }
  );
  function makeGeoJSON(csvData) {
    csv2geojson.csv2geojson(
      csvData,
      {
        latfield: "Latitude",
        lonfield: "Longitude",
        delimiter: ",",
      },
      function (err, data) {
        console.log(data);
        //Add the the layer to the map
        map.addSource("protests", {
          type: "geojson",
          data: data,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 30,
        });
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "protests",
          filter: ["has", "point_count"],
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#ffd000",
              40,
              "#ff8400",
              250,
              "#ff0000",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "protests",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });
        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "protests",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": [
              "match",
              ["get", "Estimated_Size"],
              "Unspecified",
              "hsl(357, 5%, 36%)",
              "Medium",
              "hsl(23, 89%, 45%)",
              ["Small", "small"],
              "hsl(49, 100%, 51%)",
              "Large",
              "hsl(0, 95%, 45%)",
              "hsla(0, 0%, 0%, 0)",
            ],
            "circle-opacity": 0.8,
            "circle-radius": 10,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });
        map.on("idle", () => {
        document.getElementById("reset-view").addEventListener("click", () => {
          // Fly to a random location
          map.flyTo({
            center: [60.44, 20.5],
            zoom: 5,
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          });
          popup.remove();
          
        });
      });
        map.on("click", "clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          const clusterId = features[0].properties.cluster_id;
          map
            .getSource("protests")
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;

              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
              });
            });
        });
        // When a click event occurs on a feature in the csvData layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on("click", "unclustered-point", function (e) {
          var coordinates = e.features[0].geometry.coordinates.slice();
          //set popup text
          if (e.features[0].properties.videoid == "") {
            var description = `<div class="popup"><div class="popup-date"><div class="icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 11H8V13H6V11ZM11 11H13V13H11V11ZM16 11H18V13H16V11Z" fill="currentColor"></path>
            </svg>
            </div><div class="text-block-2">${e.features[0].properties.Date}</div></div><div class="popup-date"><div class="icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.364 17.3639L12 23.7279L5.636 17.3639C4.37734 16.1052 3.52019 14.5016 3.17293 12.7558C2.82567 11.0099 3.00391 9.20035 3.6851 7.55582C4.36629 5.91129 5.51984 4.50569 6.99988 3.51677C8.47992 2.52784 10.22 2 12 2C13.78 2 15.5201 2.52784 17.0001 3.51677C18.4802 4.50569 19.6337 5.91129 20.3149 7.55582C20.9961 9.20035 21.1743 11.0099 20.8271 12.7558C20.4798 14.5016 19.6227 16.1052 18.364 17.3639V17.3639ZM12 12.9999C12.5304 12.9999 13.0391 12.7892 13.4142 12.4141C13.7893 12.0391 14 11.5304 14 10.9999C14 10.4695 13.7893 9.96078 13.4142 9.58571C13.0391 9.21064 12.5304 8.99992 12 8.99992C11.4696 8.99992 10.9609 9.21064 10.5858 9.58571C10.2107 9.96078 10 10.4695 10 10.9999C10 11.5304 10.2107 12.0391 10.5858 12.4141C10.9609 12.7892 11.4696 12.9999 12 12.9999Z" fill="currentColor"></path>
            </svg>
            </div><div class="text-block-2"><b><u>${e.features[0].properties.City_Village}</b></u> <u>${e.features[0].properties.County}</u> <u>${e.features[0].properties.Province}</u></div></div><div class="popup-date"><div class="icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 21.9999C1 19.8782 1.84285 17.8434 3.34315 16.3431C4.84344 14.8428 6.87827 13.9999 9 13.9999C11.1217 13.9999 13.1566 14.8428 14.6569 16.3431C16.1571 17.8434 17 19.8782 17 21.9999H1ZM9 12.9999C5.685 12.9999 3 10.3149 3 6.99994C3 3.68494 5.685 0.999936 9 0.999936C12.315 0.999936 15 3.68494 15 6.99994C15 10.3149 12.315 12.9999 9 12.9999ZM18.246 3.18394C18.7454 4.39409 19.0016 5.69077 19 6.99994C19.0016 8.3091 18.7454 9.60578 18.246 10.8159L16.569 9.59593C16.8552 8.76037 17.0008 7.88314 17 6.99994C17.0011 6.11678 16.8558 5.23956 16.57 4.40394L18.246 3.18394V3.18394ZM21.548 0.783936C22.5062 2.71576 23.0032 4.84353 23 6.99994C23 9.23294 22.477 11.3439 21.548 13.2159L19.903 12.0199C20.6282 10.4459 21.0025 8.733 21 6.99994C21 5.20794 20.607 3.50694 19.903 1.97994L21.548 0.783936V0.783936Z" fill="currentColor"></path>
            </svg>
            </div><div class="text-block-2">${e.features[0].properties.Estimated_Size}</div></div><div class="description">${e.features[0].properties.Description}</div><div class="div-block"><div class="w-layout-grid grid-2"><div id="w-node-_3a663dd9-9279-9e1a-bc96-7b8781166f4e-a186f4f5" class="popup-grid-div-injured"><div class="popup-grid-head">Injured</div><div class="popup-grid-head bold">${e.features[0].properties.Injured}</div></div><div id="w-node-_8cf7185e-00a1-3f76-f669-cd9000d2aab4-a186f4f5" class="popup-grid-div-arrested"><div class="popup-grid-head">Arrested</div><div class="popup-grid-head bold">${e.features[0].properties.Arrested}</div></div><div id="w-node-d6506aec-67e8-cd45-23be-9b7a043e57e3-a186f4f5" class="popup-grid-div-killed"><div class="popup-grid-head">Killed</div><div class="popup-grid-head bold">${e.features[0].properties.Killed}</div></div></div></div><div class="view-source-div"><a href="${e.features[0].properties.Link}" target="_blank" class="link-block w-inline-block"><div class="vieewsource">View Source</div><div class="external_icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6V8H5V19H16V14H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V7C3 6.73478 3.10536 6.48043 3.29289 6.29289C3.48043 6.10536 3.73478 6 4 6H10ZM21 3V12L17.206 8.207L11.207 14.207L9.793 12.793L15.792 6.793L12 3H21Z" fill="currentColor"></path>
            </svg></div></a></div></div>`;
          } else {
            var description = `<div class="popup"><div class="popup-date"><div class="icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 11H8V13H6V11ZM11 11H13V13H11V11ZM16 11H18V13H16V11Z" fill="currentColor"></path>
          </svg>
          </div><div class="text-block-2">${e.features[0].properties.Date}</div></div><div class="popup-date"><div class="icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.364 17.3639L12 23.7279L5.636 17.3639C4.37734 16.1052 3.52019 14.5016 3.17293 12.7558C2.82567 11.0099 3.00391 9.20035 3.6851 7.55582C4.36629 5.91129 5.51984 4.50569 6.99988 3.51677C8.47992 2.52784 10.22 2 12 2C13.78 2 15.5201 2.52784 17.0001 3.51677C18.4802 4.50569 19.6337 5.91129 20.3149 7.55582C20.9961 9.20035 21.1743 11.0099 20.8271 12.7558C20.4798 14.5016 19.6227 16.1052 18.364 17.3639V17.3639ZM12 12.9999C12.5304 12.9999 13.0391 12.7892 13.4142 12.4141C13.7893 12.0391 14 11.5304 14 10.9999C14 10.4695 13.7893 9.96078 13.4142 9.58571C13.0391 9.21064 12.5304 8.99992 12 8.99992C11.4696 8.99992 10.9609 9.21064 10.5858 9.58571C10.2107 9.96078 10 10.4695 10 10.9999C10 11.5304 10.2107 12.0391 10.5858 12.4141C10.9609 12.7892 11.4696 12.9999 12 12.9999Z" fill="currentColor"></path>
          </svg>
          </div><div class="text-block-2"><b><u>${e.features[0].properties.City_Village}</b></u> <u>${e.features[0].properties.County}</u> <u>${e.features[0].properties.Province}</u></div></div><div class="popup-date"><div class="icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 21.9999C1 19.8782 1.84285 17.8434 3.34315 16.3431C4.84344 14.8428 6.87827 13.9999 9 13.9999C11.1217 13.9999 13.1566 14.8428 14.6569 16.3431C16.1571 17.8434 17 19.8782 17 21.9999H1ZM9 12.9999C5.685 12.9999 3 10.3149 3 6.99994C3 3.68494 5.685 0.999936 9 0.999936C12.315 0.999936 15 3.68494 15 6.99994C15 10.3149 12.315 12.9999 9 12.9999ZM18.246 3.18394C18.7454 4.39409 19.0016 5.69077 19 6.99994C19.0016 8.3091 18.7454 9.60578 18.246 10.8159L16.569 9.59593C16.8552 8.76037 17.0008 7.88314 17 6.99994C17.0011 6.11678 16.8558 5.23956 16.57 4.40394L18.246 3.18394V3.18394ZM21.548 0.783936C22.5062 2.71576 23.0032 4.84353 23 6.99994C23 9.23294 22.477 11.3439 21.548 13.2159L19.903 12.0199C20.6282 10.4459 21.0025 8.733 21 6.99994C21 5.20794 20.607 3.50694 19.903 1.97994L21.548 0.783936V0.783936Z" fill="currentColor"></path>
          </svg>
          </div><div class="text-block-2">${e.features[0].properties.Estimated_Size}</div></div><div class="description">${e.features[0].properties.Description}</div><div class="div-block"><div class="w-layout-grid grid-2"><div id="w-node-_3a663dd9-9279-9e1a-bc96-7b8781166f4e-a186f4f5" class="popup-grid-div-injured"><div class="popup-grid-head">Injured</div><div class="popup-grid-head bold">${e.features[0].properties.Injured}</div></div><div id="w-node-_8cf7185e-00a1-3f76-f669-cd9000d2aab4-a186f4f5" class="popup-grid-div-arrested"><div class="popup-grid-head">Arrested</div><div class="popup-grid-head bold">${e.features[0].properties.Arrested}</div></div><div id="w-node-d6506aec-67e8-cd45-23be-9b7a043e57e3-a186f4f5" class="popup-grid-div-killed"><div class="popup-grid-head">Killed</div><div class="popup-grid-head bold">${e.features[0].properties.Killed}</div></div></div></div><div class="view-source-div"><a href="${e.features[0].properties.Link}" target="_blank" class="link-block w-inline-block"><div class="vieewsource">View Source</div><div class="external_icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 6V8H5V19H16V14H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V7C3 6.73478 3.10536 6.48043 3.29289 6.29289C3.48043 6.10536 3.73478 6 4 6H10ZM21 3V12L17.206 8.207L11.207 14.207L9.793 12.793L15.792 6.793L12 3H21Z" fill="currentColor"></path>
          </svg></div></a></div></div>
          <video width="100%" height="80%" autoplay>
          <source src="https://drive.google.com/uc?export=download&id=${e.features[0].properties.videoid}" type='video/mp4'>
          </video>`;
          }

          // var description = `<div class="popup"><div class="popup-date"><span class="popup-span">Date:&nbsp;</span>${e.features[0].properties.Formatted_Date}</div><div class="popup-area"><span class="popup-span">Location: </span>${e.features[0].properties.District}</div><div class="popup-area"><span class="popup-span">Estimated Size: </span>${e.features[0].properties.Estimated_Size}</div><div class="description">${e.features[0].properties.Description}</div><div class="view-source-div"><a href="${e.features[0].properties.Link}" class="link-block w-inline-block"><div>View Source</div></a></div></div>`;
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
          if (e.features[0].properties.Injured == "") {
            $(".popup-grid-div-injured").toggleClass("is-hidden");
          }
          if (e.features[0].properties.Arrested == "") {
            $(".popup-grid-div-arrested").toggleClass("is-hidden");
          }
          if (e.features[0].properties.Killed == "") {
            $(".popup-grid-div-killed").toggleClass("is-hidden");
          }
        });
        map.on("mouseenter", "clusters", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "clusters", () => {
          map.getCanvas().style.cursor = "";
        });
        map.on("mouseleave", "csvData", function () {
          map.getCanvas().style.cursor = "";
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
      }
    );
  }
});
const listingEl = document.getElementById("feature-listing");
function addRecent(data) {
  console.log(data);
  data
    .slice()
    .reverse()
    .forEach(function (row) {
      const itemLink = document.createElement("a");
      itemLink.href - "#";
      itemLink.target = "_blank";
      itemLink.className = "";
      itemLink.innerHTML = `<a href="#" class="temp-link-block w-inline-block"><div class="title-wrapper-listing"><div class="list-blue-title"><p class="bold-listing-title-mil">${row.County} <br><span title="Province" class="group-name-span">${row.Province}</span></p></div><div class="subtitle-wrapper"><div class="listing-subtitle-wrapper"><div title="Date" class="icon-featurelist w-embed"><svg width="420" height="420" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 11H8V13H6V11ZM11 11H13V13H11V11ZM16 11H18V13H16V11Z" fill="currentColor"></path>
      </svg>
      </div><p class="bold-listing-subtitle">${row.Date}</p></div><div class="listing-subtitle-wrapper"><div title="Estimated Size of Protest" class="icon-featurelist w-embed"><svg width="420" height="420" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 21.9999C1 19.8782 1.84285 17.8434 3.34315 16.3431C4.84344 14.8428 6.87827 13.9999 9 13.9999C11.1217 13.9999 13.1566 14.8428 14.6569 16.3431C16.1571 17.8434 17 19.8782 17 21.9999H1ZM9 12.9999C5.685 12.9999 3 10.3149 3 6.99994C3 3.68494 5.685 0.999936 9 0.999936C12.315 0.999936 15 3.68494 15 6.99994C15 10.3149 12.315 12.9999 9 12.9999ZM18.246 3.18394C18.7454 4.39409 19.0016 5.69077 19 6.99994C19.0016 8.3091 18.7454 9.60578 18.246 10.8159L16.569 9.59593C16.8552 8.76037 17.0008 7.88314 17 6.99994C17.0011 6.11678 16.8558 5.23956 16.57 4.40394L18.246 3.18394V3.18394ZM21.548 0.783936C22.5062 2.71576 23.0032 4.84353 23 6.99994C23 9.23294 22.477 11.3439 21.548 13.2159L19.903 12.0199C20.6282 10.4459 21.0025 8.733 21 6.99994C21 5.20794 20.607 3.50694 19.903 1.97994L21.548 0.783936V0.783936Z" fill="currentColor"></path>
      </svg>
      </div><p class="bold-listing-subtitle">${row.Estimated_Size}</p></div></div></div><p class="listing-text">${row.Description}<br></p></a>`;
      listingEl.appendChild(itemLink);
    });
}
const listingEl2 = document.getElementById("feature-listing-mobile");
function addRecentmobile(data) {
  data
    .slice()
    .reverse()
    .forEach(function (row) {
      const itemLink = document.createElement("a");
      itemLink.href - "#";
      itemLink.target = "_blank";
      itemLink.className = "";
      itemLink.innerHTML = `<a href="#" class="temp-link-block w-inline-block"><div class="title-wrapper-listing"><div class="list-blue-title"><p class="bold-listing-title-mil">${row.County} <br><span title="Province" class="group-name-span">${row.Province}</span></p></div><div class="subtitle-wrapper"><div class="listing-subtitle-wrapper"><div title="Date" class="icon-featurelist w-embed"><svg width="420" height="420" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 11H8V13H6V11ZM11 11H13V13H11V11ZM16 11H18V13H16V11Z" fill="currentColor"></path>
      </svg>
      </div><p class="bold-listing-subtitle">${row.Date}</p></div><div class="listing-subtitle-wrapper"><div title="Estimated Size of Protest" class="icon-featurelist w-embed"><svg width="420" height="420" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 21.9999C1 19.8782 1.84285 17.8434 3.34315 16.3431C4.84344 14.8428 6.87827 13.9999 9 13.9999C11.1217 13.9999 13.1566 14.8428 14.6569 16.3431C16.1571 17.8434 17 19.8782 17 21.9999H1ZM9 12.9999C5.685 12.9999 3 10.3149 3 6.99994C3 3.68494 5.685 0.999936 9 0.999936C12.315 0.999936 15 3.68494 15 6.99994C15 10.3149 12.315 12.9999 9 12.9999ZM18.246 3.18394C18.7454 4.39409 19.0016 5.69077 19 6.99994C19.0016 8.3091 18.7454 9.60578 18.246 10.8159L16.569 9.59593C16.8552 8.76037 17.0008 7.88314 17 6.99994C17.0011 6.11678 16.8558 5.23956 16.57 4.40394L18.246 3.18394V3.18394ZM21.548 0.783936C22.5062 2.71576 23.0032 4.84353 23 6.99994C23 9.23294 22.477 11.3439 21.548 13.2159L19.903 12.0199C20.6282 10.4459 21.0025 8.733 21 6.99994C21 5.20794 20.607 3.50694 19.903 1.97994L21.548 0.783936V0.783936Z" fill="currentColor"></path>
      </svg>
      </div><p class="bold-listing-subtitle">${row.Estimated_Size}</p></div></div></div><p class="listing-text">${row.Description}<br></p></a>`;
      listingEl2.appendChild(itemLink);
    });
}