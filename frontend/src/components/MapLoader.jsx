import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import Lottie from "lottie-react";
import animationData from "../assets/Animation - 1738089651426.json";
import Marker from "../assets/Playground_marker.png";
import LocationMarker from "../assets/Me_marker4.png";
import styled from "styled-components";


const libraries = ["marker"];

const mapContainerStyle = {
  width: "100%",
  height: "800px",
};

const AnimationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #f9f9f9;
  position: relative; 
`;


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
      map.setOptions({ gestureHandling: "greedy" });

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

  if (!isLoaded || !isMapLoaded) {
    console.log("Loading animation is showing...");  // Log when the animation is showing

    return (
      <AnimationContainer aria-label="Loading map, please wait">
        <Lottie
          animationData={animationData}
          loop
          style={{
            top: "50%",            // Centers the animation vertically
            left: "50%",           // Centers the animation horizontally
            transform: "translate(-50%, -50%)",  // Adjusts position to fully center
            height: "200px",       // Adjust this value to fit your design
            width: "200px",        // Adjust this value to fit your design
            zIndex: 9999,          // Ensures the animation stays on top
          }}
        />
      </AnimationContainer>
    );
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
