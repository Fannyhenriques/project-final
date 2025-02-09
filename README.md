# Final Project - Playgroundfinder

Playground Finder is a web application that helps users discover playgrounds near their location. The app fetches playground data from the Google Places API using the nearbysearch and textsearch endpoints, displaying the results on an interactive map. Users can search for playgrounds by name, city, or specific location, navigate the app with React Router, and save their favorite playgrounds to their profile.

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

## Process

## The problem

## Future enhancment
We have structured the backend to allow users to post and rate playgrounds. Additionally, we have set up a Zustand store that would enable users to submit ratings, which would then update the average rating dynamically. Although we didn’t have time to complete these features, we plan to implement them in the future.

## View it live

Link to Netlify: https://playgroundfinder.netlify.app

Link to Render: https://project-playground-api.onrender.com