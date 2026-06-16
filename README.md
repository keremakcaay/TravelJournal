# Travel Journal App

## About the Project

Travel Journal is a mobile application built with React Native and Expo.

Users can save their trips with a photo, city name, GPS location, and current temperature. Each user can create, edit, view, and delete their own trips.

## Features

* Register and login with Firebase Authentication
* Add new trips
* Upload a photo from the gallery
* Get current GPS location
* View all saved trips
* View trip details
* Edit trip information
* Delete trips
* Show current temperature using Weather API
* Offline data storage with AsyncStorage
* Pull to refresh
* Haptic feedback

## Technologies Used

* React Native
* Expo
* TypeScript
* Expo Router
* Firebase Authentication
* Firebase Firestore
* AsyncStorage
* Expo Image Picker
* Expo Location
* Expo Haptics
* Open-Meteo API
* Jest

## Installation

Clone the repository:

git clone https://github.com/keremakcaay/TravelJournal.git


Go to the project folder:

cd TravelJournal


Install packages:

npm install


Start the project:

npx expo start

Scan the QR code using Expo Go.

## Firebase

This project uses Firebase Authentication and Firestore Database.

Authentication method:

* Email and Password

Database:

* Firestore

## Testing

The project includes tests for:

* Form validation
* Coordinate formatting
* Temperature formatting
* Component rendering
* Hook functionality

Run tests:

npm test


## Native Features

The application uses:

* Photo Gallery
* GPS Location
* Haptic Feedback
* Local Storage

## External API

The app uses the Open-Meteo API to show the current temperature of the saved location.

## Offline Mode

Trip data is stored in AsyncStorage. If there is no internet connection, previously loaded trips can still be displayed.

## Build

Create Android build:


eas build --platform android --profile preview


## Screenshots

Add screenshots of:

* Home Screen
* Add Trip Screen
* Trip Detail Screen
* Profile Screen

## Author

Kerem Akçay
