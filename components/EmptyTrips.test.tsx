import { render } from "@testing-library/react-native";
import EmptyTrips from "./EmptyTrips";

describe("EmptyTrips Component", () => {
  test("renders empty trips message", async () => {
    const screen = await render(<EmptyTrips />);

    expect(screen.getByText("No trips yet")).toBeTruthy();
  });
});