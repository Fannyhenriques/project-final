import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "700px",
};

const libraries = ["marker"]; // Ensure "marker" is listed

export const MapLoader = ({ userLocation, playgrounds }) => {
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
    console.log("Playgrounds updated:", playgrounds);
    if (isLoaded && mapRef.current && playgrounds.length > 0) {
      const map = mapRef.current;

      // Disable the default markers (like the user's location or other markers)
      map.setOptions({
        disableDefaultUI: true,
        gestureHandling: "greedy", // Optional: To prevent zoom handling on mobile
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
          markerContent.style.background = "#FF6F61";
          markerContent.style.color = "#FFF";
          markerContent.style.padding = "5px";
          markerContent.style.borderRadius = "5px";
          markerContent.innerText = playground.name;

          // Create AdvancedMarkerView and place it on the map
          const marker = new google.maps.marker.AdvancedMarkerView({
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
        userMarkerContent.style.background = "#007BFF"; // Change to desired color
        userMarkerContent.style.color = "#FFF";
        userMarkerContent.style.padding = "5px";
        userMarkerContent.style.borderRadius = "50%";
        userMarkerContent.innerText = "You";

        // Create AdvancedMarkerView for user location
        const userMarker = new google.maps.marker.AdvancedMarkerView({
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


























// import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
// import { useEffect, useRef } from "react";

// const mapContainerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const libraries = ["marker"]; // Ensure "marker" is listed

// export const MapLoader = ({ userLocation, playgrounds }) => {
//   const mapRef = useRef(null); // Reference to the map
//   const { isLoaded, loadError } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
//     libraries,
//     mapIds: [import.meta.env.VITE_GOOGLE_MAP_ID],
//     version: "beta",
//   });

//   useEffect(() => {
//     console.log("Playgrounds updated:", playgrounds);
//     if (isLoaded && mapRef.current && playgrounds.length > 0) {
//       const map = mapRef.current;

//       // Disable the default markers (like the user's location or other markers)
//       map.setOptions({
//         disableDefaultUI: true,
//         gestureHandling: "greedy", // Optional: To prevent zoom handling on mobile
//       });

//       // Clear default Google markers for places
//       map.data.setStyle(() => ({
//         visible: false, // Hide any default Google Places markers
//       }));

//       // Remove existing markers before adding new ones
//       map.clearOverlays && map.clearOverlays();  // Clear old markers

//       // Advanced Markers for each playground
//       playgrounds.forEach((playground) => {
//         const { coordinates } = playground.location;
//         const lat = coordinates[1]; // Latitude is the second value
//         const lng = coordinates[0]; // Longitude is the first value

//         console.log(`Adding marker for: ${playground.name} at ${lat}, ${lng}`); // Add this for debugging

//         // HTML content for the marker
//         const markerContent = document.createElement("div");
//         markerContent.style.background = "#FF6F61";
//         markerContent.style.color = "#FFF";
//         markerContent.style.padding = "5px";
//         markerContent.style.borderRadius = "5px";
//         markerContent.innerText = playground.name;

//         // Create AdvancedMarkerView and place it on the map
//         new google.maps.marker.AdvancedMarkerView({
//           map,
//           position: { lat, lng },
//           content: markerContent,
//         });
//       });

//       //Marker for user location
//       if (userLocation) {
//         const { lat, lng } = userLocation

//         // HTML content for user location marker
//         const userMarkerContent = document.createElement("div");
//         userMarkerContent.style.background = "#007BFF"; // Change to desired color
//         userMarkerContent.style.color = "#FFF";
//         userMarkerContent.style.padding = "5px";
//         userMarkerContent.style.borderRadius = "50%";
//         userMarkerContent.innerText = "You";

//         // Create AdvancedMarkerView for user location
//         new google.maps.marker.AdvancedMarkerView({
//           map,
//           position: { lat, lng },
//           content: userMarkerContent,
//         });
//       }
//     }

//   }, [isLoaded, playgrounds, userLocation]);

//   if (loadError) {
//     return <p>Error loading map...</p>;
//   }

//   if (!isLoaded) {
//     return <p>Loading map...</p>;
//   }

//   return (
//     <GoogleMap
//       mapContainerStyle={mapContainerStyle}
//       center={userLocation}
//       zoom={12}
//       options={{
//         mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
//         disableDefaultUI: true,
//       }}
//       onLoad={(map) => (mapRef.current = map)} // Store the map reference onLoad
//     />
//   );
// };























// import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

// const mapContainerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const libraries = ["places"];

// export const MapLoader = ({ userLocation, playgrounds }) => {
//   const { isLoaded, loadError } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
//     libraries,
//     mapIds: [import.meta.env.VITE_GOOGLE_MAP_ID]
//   })
//   console.log("Google API Key:", import.meta.env.VITE_GOOGLE_API_KEY);
//   console.log("map-id:", import.meta.env.VITE_GOOGLE_MAP_ID);

//   if (loadError) {
//     return <p>Error loading map...</p>;
//   }

//   if (!isLoaded) {
//     return <p>Loading map...</p>;
//   }

//   return (
//     <GoogleMap
//       mapContainerStyle={mapContainerStyle}
//       center={userLocation}
//       zoom={12}
//       options={{
//         mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
//         disableDefaultUI: true,
//       }}
//     >
//       {playgrounds.map((playground) => {
//         const { coordinates } = playground.location;
//         const lat = coordinates[1];
//         const lng = coordinates[0];

//         return (
//           <marker-advanced
//             key={playground._id}
//             position={{ lat, lng }}
//             title={playground.name}
//           />
//         );
//       })}
//     </GoogleMap>
//   );
// };

