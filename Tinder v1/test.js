//Map Setup details
mapboxgl.accessToken =
  "pk.eyJ1IjoibnljZG90IiwiYSI6IlhHQjNQRWMifQ.cz7P1kLgUTLOlt9Lc1RQvQ";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v8",
  center: [-74.01627, 40.70563],
  zoom: 10,
  attributionControl: false
});

//Pass coordinates from html geolocation to the next function.
function geolocate() {
  this.gl = !this.gl;
  var g = document.body;
  g.classList.add("geolocationON");
  if (this.gl == true) {
    var startPos;
    var geoOptions = {
      timeout: 10 * 1000
    };

    var geoSuccess = function(position) {
      startPos = position;
      var radius = 20;
      map.flyTo({
        center: [startPos.coords.longitude, startPos.coords.latitude],
        zoom: 14,
        bearing: 0
      });
      map.addSource("geomarker", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  startPos.coords.longitude,
                  startPos.coords.latitude
                ]
              }
            }
          ]
        }
      });
      map.addLayer({
        id: "geomarker",
        type: "circle",
        source: "geomarker",
        "source-layer": "geomarker",
        paint: {
          "circle-radius": radius,
          "circle-color": "#3BBB87",
          "circle-opacity": 0.8
        }
      });
      //access the mapbox gl Canvas Container
      var container = map.getCanvasContainer();
      //create an svg
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      //put a circle in that svg.
      var circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

      function project(d) {
        return map.project(getLL(d));
      }

      function getLL(d) {
        return new mapboxgl.LngLat(+d.lon, +d.lat);
      }

      function update(e) {
        var zoom = map.getZoom(e);
        var bear = map.getBearing(e);
        var p1 = [startPos.coords.longitude, startPos.coords.latitude];
        //0.0086736 is roughly equal to 731.52 meters
        var p2 = [
          startPos.coords.longitude + 0.0086736,
          startPos.coords.latitude
        ];
        var a = map.project(p1);
        var b = map.project(p2);
        var radius = b.x - a.x;
        circle.setAttribute("r", radius);
        circle.setAttribute("cx", a.x);
        circle.setAttribute("cy", a.y);
        svg.appendChild(circle);
        container.appendChild(svg);
      }

      svg.setAttribute("id", "geoCircle");
      circle.setAttribute("class", "dot");
      circle.setAttribute(
        "style",
        "fill: rgb(255, 255, 255); fill-opacity: 0; stroke: rgb(0, 0, 0); stroke-width: 4; stroke-dasharray: 2, 2; cursor: pointer; pointer-events: none;"
      );

      map.on("viewreset", function(e) {
        update();
      });

      map.on("zoomend", function(e) {
        update();
      });

      map.on("move", function(e) {
        update();
      });
    };

    var geoError = function(error) {
      console.log("Error occurred. Error code: " + error.code);
    };
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  } else {
    map.removeSource("geomarker");
    map.removeLayer("geomarker");
    map.dragRotate.enable();
    map.touchZoomRotate.enableRotation();
    var container = map.getCanvasContainer();
    var svg = document.getElementById("geoCircle");
    container.removeChild(svg);
    g.classList.remove("geolocationON");
  }
}
