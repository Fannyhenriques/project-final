import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import Marker from "../assets/Playground_marker.png"
import LocationMarker from "../assets/Me_marker3.png"

const mapContainerStyle = {
  width: "100%",
  height: "700px",
};

const libraries = ["marker"]; // Ensure "marker" is listed

export const MapLoader = ({ userLocation, playgrounds, searchQuery }) => {
  const mapRef = useRef(null); // Reference to the map
  const [markers, setMarkers] = useState([]);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
    mapIds: [import.meta.env.VITE_GOOGLE_MAP_ID],
    version: "beta",
  });


  useEffect(() => {
    if (searchQuery && mapRef.current) {
      const matchingPlayground = playgrounds.find(
        (playground) =>
          playground.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playground.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingPlayground) {
        const [lng, lat] = matchingPlayground.location.coordinates;
        mapRef.current.panTo({ lat, lng }); // Focus on the matching playground
        mapRef.current.setZoom(15); // Optionally zoom in
      }
    }
  }, [searchQuery, playgrounds]); // Trigger whenever searchQuery or playgrounds change

  useEffect(() => {
    console.log("Playgrounds updated:", playgrounds);
    if (isLoaded && mapRef.current && playgrounds.length > 0) {
      const map = mapRef.current;

      // Disable the default markers (like the user's location or other markers)
      map.setOptions({
        disableDefaultUI: true,
        gestureHandling: "greedy", // Ensures the map handles touch gestures like zooming and dragging on mobile
      });

      // Clear existing markers before adding new ones
      markers.forEach((marker) => marker.setMap(null)); // Remove old markers
      setMarkers([]); // Reset markers state

      // Advanced Markers for each playground
      playgrounds.forEach((playground) => {
        if (playground.location && playground.location.coordinates) {
          const [lng, lat] = playground.location.coordinates;

          console.log(`Adding marker for: ${playground.name} at ${lat}, ${lng}`); // Add this for debugging


          // HTML content for the marker
          const markerContent = document.createElement("div");
          markerContent.style.position = "absolute"; // Absolute positioning for custom alignment
          markerContent.style.transform = "translate(-50%, -60%)"; // Ensures the bottom center of the marker aligns with the coordinates

          const markerImage = document.createElement("img");
          markerImage.src = Marker
          markerImage.alt = "playground-marker"
          markerImage.style.width = "80px"; // Adjust size
          markerImage.style.height = "100px"; // Adjust size
          markerImage.style.objectFit = "contain"; // Ensures the image fits properly
          markerContent.appendChild(markerImage);

          // Create AdvancedMarkerView and place it on the map
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat, lng },
            content: markerContent,
          });

          // Store the marker in the state for future removal
          setMarkers((prevMarkers) => [...prevMarkers, marker]);
        }
      });

      // Marker for user location
      if (userLocation) {
        const { lat, lng } = userLocation;

        // HTML content for user location marker
        const userMarkerContent = document.createElement("div");
        const userMarkerImage = document.createElement("img");
        userMarkerContent.style.position = "absolute"; // Absolute positioning for custom alignment
        userMarkerContent.style.transform = "translate(-50%, -60%)"; // Ensures the bottom center of the marker aligns with the coordinates
        userMarkerImage.src = LocationMarker
        userMarkerImage.alt = "User-marker"
        userMarkerImage.style.width = "80px"; // Adjust size
        userMarkerImage.style.height = "100px"; // Adjust size
        userMarkerImage.style.objectFit = "contain"; // Ensures the image fits properly
        userMarkerContent.appendChild(userMarkerImage);


        // Create AdvancedMarkerView for user location
        const userMarker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat, lng },
          content: userMarkerContent,
        });

        // Store user marker in state if needed for future removal
        setMarkers((prevMarkers) => [...prevMarkers, userMarker]);
      }
    }
  }, [isLoaded, playgrounds, userLocation]);

  if (loadError) {
    return <p>Error loading map...</p>;
  }

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={userLocation}
      zoom={12}
      options={{
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
        disableDefaultUI: true,
      }}
      onLoad={(map) => {
        mapRef.current = map; // Store the map reference onLoad
      }}
    />
  );
};

