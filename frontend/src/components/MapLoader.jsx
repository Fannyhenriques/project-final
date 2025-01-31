import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import Marker from "../assets/Playground_marker.png";
import LocationMarker from "../assets/Me_marker4.png";

const libraries = ["marker"];
const mapContainerStyle = {
  width: "100%",
  height: "800px",
};

export const MapLoader = ({ userLocation, playgrounds, searchQuery }) => {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
    mapIds: [import.meta.env.VITE_GOOGLE_MAP_ID],
    version: "beta",
  });

  const navigate = useNavigate();

  const handleMarkerClick = async (playgroundId) => {
    console.log("Fetching details for playground ID:", playgroundId);
    try {
      const response = await fetch(`https://project-playground-api.onrender.com/api/playgrounds/id/${playgroundId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch playground details");
      }
      const data = await response.json();
      console.log("Playground details:", data);
      navigate(`/playgrounds/${playgroundId}`, { state: { playground: data } });
    } catch (error) {
      console.error("Error fetching playground details:", error.message);
    }
  };

  useEffect(() => {
    console.log("isLoaded:", isLoaded);
  }, [isLoaded]);


  useEffect(() => {
    if (searchQuery && mapRef.current) {
      console.log("Search query:", searchQuery);
      const matchingPlayground = playgrounds.find(
        (playground) =>
          playground.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playground.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingPlayground) {
        const [lng, lat] = matchingPlayground.location.coordinates;
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(12);
        console.log("Pan to playground:", matchingPlayground.name);
      }
    }
  }, [searchQuery, playgrounds]);

  useEffect(() => {
    if (isLoaded && mapRef.current && playgrounds.length > 0) {
      console.log("Map is loaded and playgrounds are available:", playgrounds);
      const map = mapRef.current;
      map.setOptions({ gestureHandling: "greedy" });
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      const newMarkers = [];
      for (let i = 0; i < playgrounds.length; i++) {
        const playground = playgrounds[i];
        if (playground.location?.coordinates) {
          const [lng, lat] = playground.location.coordinates;

          const markerContent = document.createElement("div");
          markerContent.style.position = "absolute";
          markerContent.style.transform = "translate(-50%, -60%)";
          markerContent.style.cursor = "pointer";

          const markerImage = document.createElement("img");
          markerImage.src = Marker;
          markerImage.alt = "playground-marker";
          markerImage.style.width = "80px";
          markerImage.style.height = "100px";
          markerImage.style.objectFit = "contain";
          markerContent.appendChild(markerImage);

          const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat, lng },
            content: markerContent,
          });

          markerContent.onclick = () => handleMarkerClick(playground.googlePlaceId);

          console.log("Marker created for:", playground.name);
          newMarkers.push(marker);
        }
      }

      setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);

      if (userLocation) {
        const { lat, lng } = userLocation;

        const userMarkerContent = document.createElement("div");
        userMarkerContent.style.position = "absolute";
        userMarkerContent.style.transform = "translate(-50%, -60%)";

        const userMarkerImage = document.createElement("img");
        userMarkerImage.src = LocationMarker;
        userMarkerImage.alt = "User-marker";
        userMarkerImage.style.width = "80px";
        userMarkerImage.style.height = "100px";
        userMarkerImage.style.objectFit = "contain";
        userMarkerContent.appendChild(userMarkerImage);

        const userMarker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat, lng },
          content: userMarkerContent,
        });

        setMarkers((prevMarkers) => [...prevMarkers, userMarker]);
        console.log("User location marker added:", { lat, lng });
      }
    }
  }, [isLoaded, playgrounds, userLocation]);

  if (loadError) {
    console.error("Error loading map:", loadError);
    return <p>Error loading map...</p>;
  }

  if (!isLoaded) {
    console.log("Loading map...");
    return <p>Loading map....</p>;
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
        mapRef.current = map;
        console.log("Map loaded and reference set");
      }}
    />
  );
};
