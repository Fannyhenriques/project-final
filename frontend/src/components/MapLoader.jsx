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
  const [isMapLoaded, setIsMapLoaded] = useState(false);
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
      const response = await fetch(`http://localhost:9000/api/playgrounds/id/${playgroundId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch playground details");
      }
      const data = await response.json();
      console.log("Playground details:", data);

      // Navigate to the details page with the playground data
      navigate(`/playgrounds/${playgroundId}`, { state: { playground: data } });
    } catch (error) {
      console.error("Error fetching playground details:", error.message);
    }
  };

  useEffect(() => {
    console.log("isLoaded:", isLoaded);
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setIsMapLoaded(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (searchQuery && mapRef.current) {
      const matchingPlayground = playgrounds.find(
        (playground) =>
          playground.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playground.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingPlayground) {
        const [lng, lat] = matchingPlayground.location.coordinates;
        mapRef.current.panTo({ lat, lng }); // Zoom in on searched playground 
        mapRef.current.setZoom(12);
      }
    }
  }, [searchQuery, playgrounds]);

  useEffect(() => {
    if (isLoaded && mapRef.current && playgrounds.length > 0) {
      const map = mapRef.current;
      map.setOptions({ gestureHandling: "greedy" }); //Mobile friendly zoom

      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      playgrounds.forEach((playground) => {
        if (playground.location?.coordinates) {
          const [lng, lat] = playground.location.coordinates;

          const markerContent = document.createElement("div");
          markerContent.style.position = "absolute";
          markerContent.style.transform = "translate(-50%, -60%)";

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

          // Add click event to navigate when marker is clicked
          markerContent.onclick = () => handleMarkerClick(playground.googlePlaceId);

          setMarkers((prevMarkers) => [...prevMarkers, marker]);
        }
      });

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
      }
    }
  }, [isLoaded, playgrounds, userLocation]);

  if (loadError) {
    return <p>Error loading map...</p>;
  }

  if (!isLoaded) {
    return <p>Loading map....</p>
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
      }}
    />
  );
};

