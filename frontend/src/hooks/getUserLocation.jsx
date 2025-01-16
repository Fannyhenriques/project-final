window.onload = () => {
  getUserLocation();
};

export const getUserLocation = async () => {
  const fallbackCoordinates = { lat: 59.3293, lng: 18.0686 }; // Stockholm

  return new Promise((resolve) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.warn("Geolocation denied, using fallback.");
          resolve(fallbackCoordinates);
        }
      );
    } else {
      console.warn("Geolocation not supported, using fallback.");
      resolve(fallbackCoordinates);
    }
  });
};
