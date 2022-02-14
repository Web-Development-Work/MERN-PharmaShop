import React from "react";

// react-bootstrap components
// import { Badge, Button, Navbar, Nav, Container } from "react-bootstrap";

function Maps({CoOrdinates}) {
  console.log(CoOrdinates)
  const mapRef = React.useRef(null);
  React.useEffect(() => {
    let google = window.google;
    let map = mapRef.current;
    let lat = CoOrdinates[0];
    let lng = CoOrdinates[1];
    const myLatlng = new google.maps.LatLng(lat, lng);
    const mapOptions = {
      zoom: 8,
      center: myLatlng,
      scrollwheel: false,
      zoomControl: true,
    };

    map = new google.maps.Map(map, mapOptions);

    const marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      animation: google.maps.Animation.DROP,
      title: "Delivery Address",
    });

    // const contentString =
    //   '<div class="info-window-content"><h2>Hassan Apartments, Block 7 front of University Road, Karachi</h2>' +
    //   "<p>Gulshan-e-Iqbal Block 7 main university road, Karachi.</p></div>";

    // const infowindow = new google.maps.InfoWindow({
    //   content: contentString,
    // });

    // google.maps.event.addListener(marker, "click", function () {
    //   infowindow.open(map, marker);
    // });
  }, []);
  return (
    <>
      <div className="map-container">
        <div id="map" ref={mapRef}></div>
      </div>
    </>
  );
}

export default Maps;
