import { useEffect, useRef } from "react";

export const GoogleMap = ({ userLocation, playgrounds }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.google && mapRef.current && userLocation) {
      // Create a new map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation, // Center map on user's location
        zoom: 12,
      });

      // Add marker for the user's location
      new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location",
      });

      // Add markers for playgrounds
      playgrounds.forEach((playground) => {
        new window.google.maps.Marker({
          position: { lat: playground.lat, lng: playground.lng },
          map: map,
          title: playground.name,
        });
      });

      // Optional cleanup of the previous map instance if necessary
      return () => {
        mapRef.current = null;
      };
    }
  }, [userLocation, playgrounds]); // Re-run effect when userLocation or playgrounds change

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }}></div>;
};
