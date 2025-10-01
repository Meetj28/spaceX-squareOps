import React from "react";
import { render, screen } from "@testing-library/react";
import LaunchDetails from "@/components/launch/LaunchDetails";

test("renders LaunchDetails props correctly", () => {
  render(
    <LaunchDetails
      id="1"
      name="Test Mission"
      date="01/01/2020"
      rocket="Rocket X"
      success={true}
      patch="https://example.com/patch.png"
      details="This is the mission detail"
      wikipedia="https://en.wikipedia.org"
      webcast="https://youtube.com/watch?v=abc"
      onClose={() => {}}
    />
  );

  // mission title
  expect(screen.getByText("Test Mission")).toBeInTheDocument();

  // date
  expect(screen.getByText(/01\/01\/2020/)).toBeInTheDocument();

  // mission details
  expect(screen.getByText("This is the mission detail")).toBeInTheDocument();

  // external links
  expect(screen.getByText(/Wikipedia/i)).toBeInTheDocument();
  expect(screen.getByText(/Webcast/i)).toBeInTheDocument();

  // patch image presence
  const img = screen.getByAltText("Test Mission patch") as HTMLImageElement;
  expect(img).toBeInTheDocument();
  expect(img.src).toContain("patch.png");
});
