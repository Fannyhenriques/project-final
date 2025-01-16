import { useEffect, useState } from "react";
import { GoogleMap } from "./GoogleMap";



export const MapLoader = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Google Maps script only once when the component mounts
  useEffect(() => {
    const apiEnv = import.meta.env.VITE_GOOGLE_API_KEY;

    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById("googleMapsScript");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiEnv}&libraries=places`;
        script.id = "googleMapsScript";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
          console.log("Google Maps script loaded successfully.");
          setIsScriptLoaded(true); // Set the flag to true when the script loads
        };

        script.onerror = () => {
          console.error("Error loading Google Maps API.");
        };
      } else {
        setIsScriptLoaded(true); // Script already exists, no need to reload
      }
    };

    loadGoogleMapsScript();
  }, []); // This will only run once when the component mounts


  if (!isScriptLoaded || !userLocation) {
    return <p>Loading...</p>; // Display loading message until location and script are ready
  }

  return <GoogleMap userLocation={userLocation} playgrounds={playgrounds} />; // Pass location to GoogleMap component
};
