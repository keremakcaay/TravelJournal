import {
    formatCoordinates,
    formatTemperature,
    getEmptyTripsMessage,
    isTripFormValid,
} from "./tripUtils";

describe("tripUtils business logic", () => {
  test("valid trip form returns true", () => {
    expect(
      isTripFormValid("Paris Trip", "Paris", "image-uri", 48.8566, 2.3522)
    ).toBe(true);
  });

  test("trip form is invalid when trip name is empty", () => {
    expect(isTripFormValid("", "Paris", "image-uri", 48.8566, 2.3522)).toBe(
      false
    );
  });

  test("trip form is invalid when city is empty", () => {
    expect(isTripFormValid("Paris Trip", "", "image-uri", 48.8566, 2.3522)).toBe(
      false
    );
  });

  test("trip form is invalid when image is missing", () => {
    expect(isTripFormValid("Paris Trip", "Paris", null, 48.8566, 2.3522)).toBe(
      false
    );
  });

  test("trip form is invalid when latitude is missing", () => {
    expect(
      isTripFormValid("Paris Trip", "Paris", "image-uri", undefined, 2.3522)
    ).toBe(false);
  });

  test("trip form is invalid when longitude is missing", () => {
    expect(isTripFormValid("Paris Trip", "Paris", "image-uri", 48.8566)).toBe(
      false
    );
  });

  test("coordinates are formatted to four decimals", () => {
    expect(formatCoordinates(48.8566123, 2.3522456)).toBe(
      "48.8566, 2.3522"
    );
  });

  test("temperature is formatted with Celsius symbol", () => {
    expect(formatTemperature(23)).toBe("23°C");
  });

  test("logged in empty state message is correct", () => {
    expect(getEmptyTripsMessage(true)).toBe(
      "Add your first trip from Add Trip."
    );
  });

  test("guest empty state message is correct", () => {
    expect(getEmptyTripsMessage(false)).toBe(
      "Please login from Profile to see your trips."
    );
  });
});