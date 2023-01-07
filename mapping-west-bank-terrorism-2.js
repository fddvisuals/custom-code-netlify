const bounds = [
  [30.49348619306887, 31.56433881543822], // SW coordinates
  [39.32964629136373, 29.36986947049448], // NE coordinates
];
mapboxgl.accessToken =
  "pk.eyJ1IjoicGF2YWtwYXRlbCIsImEiOiJja3IwbnNqejUxdHpmMm5tbnFoa2tsNDcxIn0.Mi-o-UdZ0hTFy2iN7QBHrg";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/pavakpatel/cl9goeb54004914o0f9zfa9ah",
  center: [35.1708741, 31.9485955],
  minZoom: 6.5,
  //maxBounds: bounds
});
let wbevents = [];
const popup = new mapboxgl.Popup({
  closeButton: true,
});

const filterGroup = document.getElementById("filter-group");
const filterEl = document.getElementById("feature-filter");
const listingEl = document.getElementById("feature-listing");

function renderListings(features) {
  const empty = document.createElement("p");
  // Clear any existing listings
  listingEl.innerHTML = "";
  if (features.length) {
    for (const feature of features) {
      const itemLink = document.createElement("a");
      itemLink.href = "#";
      itemLink.target = "_blank";
      itemLink.className = "temp-link-block w-inline block";
      if (feature.properties.Group == "Terrorists") {
        //revert this if it gets too.. get older version of this html
        itemLink.innerHTML = `<div class="title-wrapper-listing"><div class="list-blue-title"><img src="${feature.properties.type_icon_url}" loading="lazy" alt="" class="listing-icon red"><p class="bold-listing-title-mil"> ${feature.properties.Type} | ${feature.properties.Group} <br><span class="group-name-span">${feature.properties.TerroristGroupTags}</span></p></div><div class="subtitle-wrapper"><div class="listing-subtitle-wrapper"><img src="https://uploads-ssl.webflow.com/6352289bab9b05d2a93f26f6/6381d9eac6b1ef242239cb16_Vector-1.svg" loading="lazy" alt="" class="listing-sub-icon"><p class="bold-listing-subtitle">${feature.properties.formatted_date}</p></div><div class="listing-subtitle-wrapper"><img src="https://uploads-ssl.webflow.com/6352289bab9b05d2a93f26f6/6381d9eac50a51f40b798700_Vector.svg" loading="lazy" alt="" class="listing-sub-icon"><p class="bold-listing-subtitle">${feature.properties.Display_name}</p></div></div></div><p class="listing-text">${feature.properties.Notes}</p>`;
      } else {
        itemLink.innerHTML = `<div class="title-wrapper-listing"><div class="list-blue-title"><img src="${feature.properties.type_icon_url}" loading="lazy" alt="" class="listing-icon blue"><p class="bold-listing-title-idf"> ${feature.properties.Type} | ${feature.properties.Group} <br><span class="group-name-span">${feature.properties.TerroristGroupTags}</span></p></div><div class="subtitle-wrapper"><div class="listing-subtitle-wrapper"><img src="https://uploads-ssl.webflow.com/6352289bab9b05d2a93f26f6/6381d9eac6b1ef242239cb16_Vector-1.svg" loading="lazy" alt="" class="listing-sub-icon"><p class="bold-listing-subtitle">${feature.properties.formatted_date}</p></div><div class="listing-subtitle-wrapper"><img src="https://uploads-ssl.webflow.com/6352289bab9b05d2a93f26f6/6381d9eac50a51f40b798700_Vector.svg" loading="lazy" alt="" class="listing-sub-icon"><p class="bold-listing-subtitle">${feature.properties.Display_name}</p></div></div></div><p class="listing-text">${feature.properties.Notes}</p>`;
      }
      // https://assets.website-files.com/6352289bab9b05d2a93f26f6/6380e46abd14020aa9b1fe30_handcuffs-svgrepo-com.svg
      itemLink.addEventListener("mouseover", () => {
        popupGenerator(feature);
      });
      itemLink.onclick = function () {
        // setActive(listing);

        // When a menu item is clicked, animate the map to center
        // its associated locale and open its popup.
        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 16,
        });
        //locale.openPopup();
        return false;
      };
      listingEl.appendChild(itemLink);
    }
    // Show the filter input
    filterEl.parentNode.style.display = "none";
  } else if (features.length === 0 && filterEl.value !== "") {
    empty.textContent = "No results found";
    listingEl.appendChild(empty);
  } else {
    empty.textContent = "";
    listingEl.appendChild(empty);
    // Hide the filter input
    filterEl.parentNode.style.display = "none";
    // remove features filter
    // map.setFilter("data-driven-circles", ["has", "Group"]);
  }
}
const months = [
  "January 2022",
  "February 2022",
  "March 2022",
  "April 2022",
  "May 2022",
  "June 2022",
  "July 2022",
  "August 2022",
  "September 2022",
  "October 2022",
  "November 2022",
  "December 2022",
  "All | March to December",
];
let allfilter = [
  [
    "all",
    [
      "match",
      ["get", "Group"],
      [
        "Terrorists",
        "Clash",
        "IDF, Shin Bet",
        "IDF",
        "Shin Bet",
        "Israel Police, Shin Bet",
        "Israel Police",
        "IDF, Israel Police",
      ],
      true,
      false,
    ],
    // ["match", ["get", "mm"], [globalvariablemonth + 1], true, false],
  ],
];
var globalvariablemonth;
var globalisclicked = 2;

//Generates popup for listing and for map mousover
function popupGenerator(feature) {
  if (feature.properties.Group == "Terrorists") {
    popup
      .setLngLat(feature.geometry.coordinates)
      .setHTML(
        `<div class="popup-wrapper"><div class="pop-title-wrapper red"><img src="${feature.properties.type_icon_url}" loading="lazy" alt="" class="listing-icon red"><h4 class="popup-heading">${feature.properties.Type}</h4></div><p class="popup-para">${feature.properties.Notes}</p><a href="${feature.properties.URL}" target="_blank" class="view-source-button-popup w-inline-block"><p class="paragraph-4">View Source</p><div class="icon-5 w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 6V8H5V19H16V14H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V7C3 6.73478 3.10536 6.48043 3.29289 6.29289C3.48043 6.10536 3.73478 6 4 6H10ZM21 3V11H19V6.413L11.207 14.207L9.793 12.793L17.585 5H13V3H21Z" fill="currentColor"></path>
        </svg>
        </div></a></div>`
      )
      .addTo(map);
  } else {
    popup
      .setLngLat(feature.geometry.coordinates)
      .setHTML(
        `<div class="popup-wrapper"><div class="pop-title-wrapper blue"><img src="${feature.properties.type_icon_url}" loading="lazy" alt="" class="listing-icon blue"><h4 class="popup-heading">${feature.properties.Type}</h4></div><p class="popup-para">${feature.properties.Notes}</p><a href="${feature.properties.URL}" target="_blank" class="view-source-button-popup w-inline-block"><p class="paragraph-4">View Source</p><div class="icon-5 w-embed"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 6V8H5V19H16V14H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V7C3 6.73478 3.10536 6.48043 3.29289 6.29289C3.48043 6.10536 3.73478 6 4 6H10ZM21 3V11H19V6.413L11.207 14.207L9.793 12.793L17.585 5H13V3H21Z" fill="currentColor"></path>
        </svg>
        </div></a></div>`
      )
      .addTo(map);
  }
}

function normalize(string) {
  return string.trim().toLowerCase();
}
function getUniqueFeatures(features, comparatorProperty) {
  const uniqueIds = new Set();
  const uniqueFeatures = [];
  for (const feature of features) {
    const id = feature.properties[comparatorProperty];
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      uniqueFeatures.push(feature);
    }
  }
  return uniqueFeatures;
}
map.on("load", () => {
  map.on("click", "data-driven-circles", (e) => {
    map.flyTo({
      center: e.features[0].geometry.coordinates,
      zoom: 16,
    });
  });
  map.on("movestart", () => {});
  map.on("moveend", () => {
    renderList();
  });
  map.on("mousemove", "data-driven-circles", (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";
    // Populate the popup and set its coordinates based on the feature.
    const feature = e.features[0];
    popupGenerator(feature);
  });
  map.on("mouseleave", "data-driven-circles", () => {
    map.getCanvas().style.cursor = "";
    // popup.remove();
  });
  filterEl.addEventListener("keyup", (e) => {
    const value = normalize(e.target.value);
    // Filter visible features that match the input value.
    const filtered = [];
    for (const feature of wbevents) {
      const mm2 = normalize(feature.properties.mm);
      if (mm2 == month) {
        filtered.push(feature);
      }
    }
    // Populate the sidebar with filtered results
    renderListings(filtered);
    // Set the filter to populate features into the layer.
    if (filtered.length) {
      map.setFilter("data-driven-circles", [
        "all",
        ["match", ["get", "Group"], ["Terrorists", "Clash"], true, false],
        filtered.map((feature) => {
          return feature.properties.id;
        }),
        true,
        false,
      ]);
    }
  });
  map.on("idle", () => {
    renderList();
    if (!map.getLayer("heatmap") || !map.getLayer("data-driven-circles")) {
      return;
    }
    // Enumerate ids of the layers.

    var blue = document.getElementById("idf-button");
    var red = document.getElementById("mil-button");
    var all = document.getElementById("show-all-button");

    let bluefilter = [
      "all",
      [
        "match",
        ["get", "Group"],
        [
          "IDF, Shin Bet",
          "IDF",
          "Shin Bet",
          "Israel Police, Shin Bet",
          "Israel Police",
          "IDF, Israel Police",
        ],
        true,
        false,
      ],
      ["match", ["get", "mm"], [globalvariablemonth], true, false],
    ];
    let redfilter = [
      "all",
      ["match", ["get", "Group"], ["Terrorists", "Clash"], true, false],
      ["match", ["get", "mm"], [globalvariablemonth], true, false],
    ];

    let monthfilter = [
      "all",
      ["match", ["get", "mm"], [globalvariablemonth], true, false],
    ];

    let blueall = [
      "all",
      [
        "match",
        ["get", "Group"],
        [
          "IDF, Shin Bet",
          "IDF",
          "Shin Bet",
          "Israel Police, Shin Bet",
          "Israel Police",
          "IDF, Israel Police",
        ],
        true,
        false,
      ],
      // ["match", ["get", "mm"], [globalvariablemonth], true, false],
    ];
    let redall = [
      "all",
      ["match", ["get", "Group"], ["Terrorists", "Clash"], true, false],
      // ["match", ["get", "mm"], [globalvariablemonth], true, false],
    ];
    blue.onclick = function (e) {
      red.className = "filter-button red";
      this.className = "filter-button bluew active";
      if (globalvariablemonth != 13) {
        map.setFilter("data-driven-circles", bluefilter);
        map.setFilter("heatmap", bluefilter);
      } else {
        map.setFilter("data-driven-circles", blueall);
        map.setFilter("heatmap", blueall);
      }
      globalThis.globalisclicked = 1;
      popup.remove();
    };
    red.onclick = function (e) {
      blue.className = "filter-button bluew";
      this.className = "filter-button red active";
      if (globalvariablemonth != 13) {
        map.setFilter("data-driven-circles", redfilter);
        map.setFilter("heatmap", redfilter);
      } else {
        map.setFilter("data-driven-circles", redall);
        map.setFilter("heatmap", redall);
      }
      globalThis.globalisclicked = 2;
      popup.remove();
    };
    all.onclick = function (e) {
      if (globalvariablemonth != 13) {
        map.setFilter("data-driven-circles", null);
        map.setFilter("heatmap", null);
        map.setFilter("data-driven-circles", monthfilter);
        map.setFilter("heatmap", monthfilter);
      } else {
        map.setFilter("data-driven-circles", null);
        map.setFilter("heatmap", null);
      }
      globalThis.globalisclicked = 3;
      popup.remove();
    };
  });

  //filterby function
  const mnthfilter = [];
  function filterBy(month) {
    if (month == "12") {
      if (globalisclicked == 1) {
        let blueall1 = [
          "all",
          [
            "match",
            ["get", "Group"],
            [
              "IDF, Shin Bet",
              "IDF",
              "Shin Bet",
              "Israel Police, Shin Bet",
              "Israel Police",
              "IDF, Israel Police",
            ],
            true,
            false,
          ],
          // ["match", ["get", "mm"], [globalvariablemonth], true, false],
        ];

        map.setFilter("data-driven-circles", blueall1);
        map.setFilter("heatmap", blueall1);
      } else {
        let redall1 = [
          "all",
          ["match", ["get", "Group"], ["Terrorists", "Clash"], true, false],
          // ["match", ["get", "mm"], [globalvariablemonth], true, false],
        ];
        map.setFilter("data-driven-circles", redall1);
        map.setFilter("heatmap", redall1);
      }
    } else {
      if (globalisclicked == 1) {
        let mnthfilter = [
          "all",
          [
            "match",
            ["get", "Group"],
            [
              "IDF, Shin Bet",
              "IDF",
              "Shin Bet",
              "Israel Police, Shin Bet",
              "Israel Police",
              "IDF, Israel Police",
            ],
            true,
            false,
          ],
          ["match", ["get", "mm"], [month + 1], true, false],
        ];
        map.setFilter("data-driven-circles", mnthfilter);
        map.setFilter("heatmap", mnthfilter);
      } else if (globalisclicked == 2) {
        let mnthfilter = [
          "all",
          ["match", ["get", "Group"], ["Terrorists", "Clash"], true, false],
          ["match", ["get", "mm"], [month + 1], true, false],
        ];
        map.setFilter("data-driven-circles", mnthfilter);
        map.setFilter("heatmap", mnthfilter);
      } else {
        let mnthfilter = ["==", "mm", month + 1];
        map.setFilter("data-driven-circles", mnthfilter);
        map.setFilter("heatmap", mnthfilter);
      }
    }
    // Set the label to the month
    document.getElementById("month").textContent = months[month];
    globalThis.globalvariablemonth = month + 1;
  }

  filterBy(12);

  //Listen for slider input and invoke filterBy (month)
  document.getElementById("slider").addEventListener("input", (e) => {
    const month = parseInt(e.target.value, 10);
    filterBy(month);
    globalThis.globalvariablemonth = month + 1;
    popup.remove();
  });
  renderListings([]);

  //Listen for Reset View
  document.getElementById("reset-view").addEventListener("click", () => {
    // Fly to a random location
    map.flyTo({
      center: [35.1708741, 31.9485955],
      zoom: 6.5,
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
    popup.remove();
  });
});
function renderList() {
  const features = map.queryRenderedFeatures({
    layers: ["data-driven-circles"],
  });
  if (features) {
    const uniqueFeatures = getUniqueFeatures(features, "wb-id");
    // Populate features for the listing overlay.
    renderListings(uniqueFeatures);
    // Clear the input container
    filterEl.value = "";
    // Store the current features in sn `wbevents` variable to later use for filtering on `keyup`.
    wbevents = uniqueFeatures;
  }
}
