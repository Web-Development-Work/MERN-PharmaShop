import React from "react";

// react-bootstrap components
// import { Badge, Button, Navbar, Nav, Container } from "react-bootstrap";

function MapMarker() {
  const mapRef = React.useRef(null);
  React.useEffect(() => {
    let google = window.google;
    let map = mapRef.current;
    const mapOptions = {
      zoom: 8,
      center: { lat: 48.00, lng: -122.00 },
      scrollwheel: false,
      zoomControl: true,
    };

    map = new google.maps.Map(map, mapOptions);

    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: { lat: 48.00, lng: -122.00 },
    });

    infoWindow.open(map);
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
      console.log(mapsMouseEvent.latLng.toJSON())
      localStorage.setItem('PS-lat',mapsMouseEvent.latLng.toJSON().lat)
      localStorage.setItem('PS-lng',mapsMouseEvent.latLng.toJSON().lng)
      // Close the current InfoWindow.
      infoWindow.close();
      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      );
      infoWindow.open(map);
    });

  }, []);
  return (
    <>
      <div className="map-container">
        <div id="map" ref={mapRef}></div>
      </div>
    </>
  );
}

export default MapMarker;
