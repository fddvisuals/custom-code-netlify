// Detect when element are loaded
function waitForElement(selector) {
  return new Promise(function (resolve, reject) {
    let element = document.querySelector(selector);

    if (element) {
      resolve(element);
      return;
    }

    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        let nodes = Array.from(mutation.addedNodes);
        for (let node of nodes) {
          if (node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}

let transformRequest = (url, resourceType) => {
  const isMapboxRequest = url.indexOf("mapbox.com") !== -1;

  return {
    url: isMapboxRequest ? url.replace("?", "?pluginName=sheetMapper&") : url,
  };
};

mapboxgl.accessToken =
  "pk.eyJ1IjoicGF2YWtwYXRlbCIsImEiOiJja3IwbnNqejUxdHpmMm5tbnFoa2tsNDcxIn0.Mi-o-UdZ0hTFy2iN7QBHrg";
var map = new mapboxgl.Map({
  container: "map", // container id
  style: "mapbox://styles/pavakpatel/clc951nvr00ch14oxscsbswec",
  center: [49.4, 35.7], // starting position [lng, lat]
  zoom: 5.5, // starting zoom
  cluster: true,
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
$.ajax(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=412844906&range=e2&single=true&output=csv"
).done(function (lastupdated) {
  document.getElementById("last-updated").innerHTML = lastupdated;
});
$.ajax(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=1972050773&range=e2:c2&single=true&output=csv"
).done(function (cell11) {
  document.getElementById("cell-11").innerHTML = cell11;
  // document.getElementById("cell-12").innerHTML = cell11[1];
});

map.on("load", function () {
  Papa.parse(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?gid=0&single=true&output=csv",
    {
      download: true,
      header: true,
      complete: function (results) {
        addPoints(results.data);
      },
    }
  );
});

function buildPopup(row) {
  let popup = `<div class="popup"><div class="popup-date"><div class="icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 11H8V13H6V11ZM11 11H13V13H11V11ZM16 11H18V13H16V11Z" fill="currentColor"></path>
              </svg>
              </div><div class="text-block-2">${row.Date}</div></div><div class="popup-date"><div class="icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.364 17.3639L12 23.7279L5.636 17.3639C4.37734 16.1052 3.52019 14.5016 3.17293 12.7558C2.82567 11.0099 3.00391 9.20035 3.6851 7.55582C4.36629 5.91129 5.51984 4.50569 6.99988 3.51677C8.47992 2.52784 10.22 2 12 2C13.78 2 15.5201 2.52784 17.0001 3.51677C18.4802 4.50569 19.6337 5.91129 20.3149 7.55582C20.9961 9.20035 21.1743 11.0099 20.8271 12.7558C20.4798 14.5016 19.6227 16.1052 18.364 17.3639V17.3639ZM12 12.9999C12.5304 12.9999 13.0391 12.7892 13.4142 12.4141C13.7893 12.0391 14 11.5304 14 10.9999C14 10.4695 13.7893 9.96078 13.4142 9.58571C13.0391 9.21064 12.5304 8.99992 12 8.99992C11.4696 8.99992 10.9609 9.21064 10.5858 9.58571C10.2107 9.96078 10 10.4695 10 10.9999C10 11.5304 10.2107 12.0391 10.5858 12.4141C10.9609 12.7892 11.4696 12.9999 12 12.9999Z" fill="currentColor"></path>
              </svg>
              </div><div class="text-block-2"> <b><u>${row.City_Village}</b></u> <u>${row.County}</u> <u>${row.Province}</u></div></div><div class="description">${row.Description}</div><div class="div-block"><div class="Grid 2"><div id="w-node-_0edc2b5e-7252-03a7-e360-cd0affc03942-a186f4f5" class="popup-grid-div"><div class="popup-grid-head">Size of Protest</div><div class="popup-grid-head bold">${row.Estimated_Size}</div></div>
              <div id="w-node-_3a663dd9-9279-9e1a-bc96-7b8781166f4e-a186f4f5" class="popup-grid-div-injured"><div class="popup-grid-head">Injured</div><div class="popup-grid-head bold">${row.Injured}</div></div><div id="w-node-_8cf7185e-00a1-3f76-f669-cd9000d2aab4-a186f4f5" class="popup-grid-div-arrested"><div class="popup-grid-head">Arrested</div><div class="popup-grid-head bold">${row.Arrested}</div></div><div id="w-node-d6506aec-67e8-cd45-23be-9b7a043e57e3-a186f4f5" class="popup-grid-div-killed"><div class="popup-grid-head">Killed</div><div class="popup-grid-head bold">${row.Killed}</div></div></div></div><div class="view-source-div"><a href="${row.Link}" target="_blank" class="link-block w-inline-block"><div class="vieewsource">View Source</div><div class="external_icon w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6V8H5V19H16V14H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V7C3 6.73478 3.10536 6.48043 3.29289 6.29289C3.48043 6.10536 3.73478 6 4 6H10ZM21 3V12L17.206 8.207L11.207 14.207L9.793 12.793L15.792 6.793L12 3H21Z" fill="currentColor"></path>
              </svg></div></a></div></div>`;

  return popup;
}
function addPoints(data) {
  data.forEach(function (row) {
    let popup = new mapboxgl.Popup().setHTML(buildPopup(row));
    let Long = row.Longitude;
    let Lat = row.Latitude;

    let el = document.createElement("div");
    el.className = "marker";
    if (row.Estimated_Size == "Large") {
      el.innerHTML = `<svg width="12" height="12" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9.5" cy="9.5" r="9.5" fill="#C47070" fill-opacity="0.5"/>
    <circle cx="9.5" cy="9.5" r="9" stroke="black" stroke-opacity="0.5"/>
    </svg>`;
    } else if (row.Estimated_Size == "Small") {
      el.innerHTML = `<svg width="2" height="12" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9.5" cy="9.5" r="9.5" fill="green" fill-opacity="0.5"/>
    <circle cx="9.5" cy="9.5" r="9" stroke="black" stroke-opacity="0.5"/>
    </svg>`;
    } else if (row.Estimated_Size == "Medium") {
      el.innerHTML = `<svg width="12" height="12" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9.5" cy="9.5" r="9.5" fill="orange" fill-opacity="0.5"/>
    <circle cx="9.5" cy="9.5" r="9" stroke="black" stroke-opacity="0.5"/>
    </svg>`;
    } else {
      el.innerHTML = `<svg width="12" height="12" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9.5" cy="9.5" r="9.5" fill="grey" fill-opacity="0.5"/>
    <circle cx="9.5" cy="9.5" r="9" stroke="black" stroke-opacity="0.5"/>
    </svg>`;
    }
    try {
      let marker = new mapboxgl.Marker(el)
        .setLngLat([Long, Lat])
        .setPopup(popup)
        .addTo(map);
    } catch (error) {
      console.log(`Error: ${error}. Row: ${row.webid}`);
    }
  });
}
