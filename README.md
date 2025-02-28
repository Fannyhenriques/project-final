# Final Project - Playgroundfinder

Playground Finder is a web application that helps users discover playgrounds near their location. The app fetches playground data from the Google Places API using the nearbysearch and textsearch endpoints, displaying the results on an interactive map. Users can search for playgrounds by name, city, or specific location, navigate the app with React Router, and save their favorite playgrounds to their profile. Created by Fanny Henriques and Anna Hansen.

## Features

- Find Nearby Playgrounds: Uses the user's coordinates to fetch playgrounds within a specific radius.
- Search by Name or Location: Users can search playgrounds by name, city, or specific location.
- Interactive Map: Displays playgrounds visually on a map.
- User Authentication: Users can create an account, log in, and manage their profile.
- Save Favorite Playgrounds: Logged-in users can save playgrounds to their profile for quick access.
- Navigation: Uses React Router for seamless navigation within the app.

## Technologies Used

- Frontend: React, React Router, Zustand (for state management), Styled Components
- Backend: Node.js, Express.js, MongoDB & Mongoose, Custom Token Authentication, Bcrypt, Axios
- Database: MongoDB
- APIs: Google Places API (Nearby Search & Text Search for playgrounds), Geolocation API (used to get the user's current location)

## The Process

Backend:
We started by defining schemas for Playground and User in the backend, along with middleware for authentication. We implemented routes for user registration, login, profile access, and posting playgrounds. The POST route allows users to save a playground to their profile.
To fetch data from the Google Places API, we created two helper functions:

- Nearby Playgrounds Search (using the nearbySearch endpoint) – retrieves playgrounds based on the user's location by dynamically constructing the API URL with latitude, longitude, and search radius.
- Playground Search by Name (using the textSearch endpoint) – searches for playgrounds by name if provided.
  If neither name nor coordinates are provided, the API defaults to fallback coordinates for Stockholm. Additionally, we implemented an ID-based route to fetch detailed information about a specific playground.

Frontend:

- To display the playgrounds on a map, we used Google Maps. We created a custom hook with the Geolocation API to retrieve the user's current location. On the homepage, this hook runs on page load, and if a search query is entered, the displayed playgrounds update based on the specified location.
- We initialized a Google Map in the MapLoader component using the @react-google-maps/api library, displaying playgrounds as markers. If a matching result is found, the map pans to that location and zooms in.
- For state management—handling user registration, login, fetching the profile page, saving playgrounds, and logging out—we used Zustand. To ensure user data persists, we stored it in localStorage using Zustand’s persist middleware.

## Future enhancment

We have structured the backend to allow users to post and rate playgrounds. Additionally, we have set up a Zustand store that would enable users to submit ratings, which would then update the average rating dynamically. Although we didn’t have time to complete these features, we plan to implement them in the future.

## View it live

Link to Netlify: https://playgroundfinder.netlify.app

Link to Render: https://project-playgroundfinder-api.onrender.com
