import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Marker from "../assets/Playground_marker.png";
import LocationMarker from "../assets/Me_marker4.png";

const libraries = ["marker", "places"];

const MapContainer = styled.div`
  width: 100%;
  height: 800px;
`;

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

  //Event handler: handles marker click events 
  //fetch ID from our backend API- Fetches details of the selected playground and navigates to its detail page.

  const handleMarkerClick = async (playgroundId) => {
    try {
      const response = await fetch(
        `https://project-playground-api.onrender.com/api/playgrounds/id/${playgroundId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch playground details");
      }
      const data = await response.json();
      navigate(`/playgrounds/${playgroundId}`, { state: { playground: data } });
    } catch (error) {
      console.error("Error fetching playground details:", error.message);
    }
  };

  /**
   * Effect Hook: Runs when the search query changes.
   * Finds a matching playground and moves the map view to its location.
   */
  useEffect(() => {
    if (searchQuery && mapRef.current) {
      const matchingPlayground = playgrounds.find(
        (playground) =>
          playground.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playground.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingPlayground) {
        const [lng, lat] = matchingPlayground.location.coordinates;
        mapRef.current.panTo({ lat, lng });  // Moves the map to the searched location
        mapRef.current.setZoom(12);
      }
    }
  }, [searchQuery, playgrounds]);


  useEffect(() => {
    if (isLoaded && mapRef.current && playgrounds.length > 0) {
      const map = mapRef.current;
      map.setOptions({ gestureHandling: "greedy" });  // Allows easier touch interactions
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      const newMarkers = [];
      playgrounds.forEach((playground) => {
        if (playground.location?.coordinates) {
          const [lng, lat] = playground.location.coordinates;

          const markerContent = document.createElement("div");
          markerContent.style.position = "absolute";
          markerContent.style.transform = "translate(-50%, -60%)";
          markerContent.style.cursor = "pointer";

          const markerImage = document.createElement("img");
          markerImage.src = Marker;
          markerImage.alt = "playground-marker";
          markerImage.style.width = "30px";
          markerImage.style.height = "50px";
          markerImage.style.objectFit = "contain";
          markerContent.appendChild(markerImage);

          const tooltip = document.createElement("div");
          tooltip.innerText = playground.name;
          tooltip.style.position = "absolute";
          tooltip.style.background = "white";
          tooltip.style.padding = "5px 10px";
          tooltip.style.borderRadius = "5px";
          tooltip.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
          tooltip.style.whiteSpace = "nowrap";
          tooltip.style.visibility = "hidden";
          tooltip.style.transform = "translate(-50%, -120%)";
          markerContent.appendChild(tooltip);

          //Desktop function
          markerContent.onmouseover = () => {
            tooltip.style.visibility = "visible";
          };

          markerContent.onmouseout = () => {
            tooltip.style.visibility = "hidden";
          };

          const isMobile = window.innerWidth <= 768; // Check if screen is mobile size

          const label = document.createElement("div");
          label.innerText = playground.name;
          label.style.position = "absolute";
          label.style.padding = "5px 10px";
          label.style.background = "white";
          label.style.borderRadius = "5px";
          label.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
          label.style.whiteSpace = "nowrap";
          label.style.zIndex = "1000";

          if (isMobile) {
            label.style.visibility = "visible";
            label.style.transform = "translate(10px, -50%)";
          } else {
            label.style.visibility = "hidden";
            label.style.transform = "translate(-50%, -120%)";
          }

          markerContent.appendChild(label);

          // Show tooltip on hover (for desktops/tablets)
          if (!isMobile) {
            markerContent.onmouseover = () => {
              label.style.visibility = "visible";
            };

            markerContent.onmouseout = () => {
              label.style.visibility = "hidden";
            };
          }


          const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat, lng },
            content: markerContent,
          });

          markerContent.onclick = () => handleMarkerClick(playground.googlePlaceId);

          newMarkers.push(marker);
        }
      });

      setMarkers(newMarkers);

      if (userLocation) {
        const { lat, lng } = userLocation;

        const userMarkerContent = document.createElement("div");
        userMarkerContent.style.position = "absolute";
        userMarkerContent.style.transform = "translate(-50%, -60%)";

        const userMarkerImage = document.createElement("img");
        userMarkerImage.src = LocationMarker;
        userMarkerImage.alt = "User-marker";
        userMarkerImage.style.width = "30px";
        userMarkerImage.style.height = "50px";
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
    return <p>Loading map....</p>;
  }

  return (
    <MapContainer>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
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
    </MapContainer>
  );
};