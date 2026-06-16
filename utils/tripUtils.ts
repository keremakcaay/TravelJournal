export function isTripFormValid(
  tripName: string,
  city: string,
  image: string | null,
  latitude?: number,
  longitude?: number
) {
  return Boolean(
    tripName.trim() &&
      city.trim() &&
      image &&
      latitude !== undefined &&
      longitude !== undefined
  );
}

export function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export function formatTemperature(temp: number) {
  return `${temp}°C`;
}

export function getEmptyTripsMessage(isLoggedIn: boolean) {
  return isLoggedIn
    ? "Add your first trip from Add Trip."
    : "Please login from Profile to see your trips.";
}