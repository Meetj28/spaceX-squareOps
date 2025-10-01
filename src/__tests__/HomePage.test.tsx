import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "@/app/page"; // adjust path if needed
import { FavoritesProvider } from "@/context/FavoritesContext";

const mockLaunches = [
  {
    id: "1",
    name: "Alpha Mission",
    date_utc: "2020-01-01T00:00:00.000Z",
    rocket: "r1",
    success: true,
    links: { patch: { small: null, large: null } },
    details: "alpha details",
  },
  {
    id: "2",
    name: "Beta Mission",
    date_utc: "2021-05-05T00:00:00.000Z",
    rocket: "r2",
    success: false,
    links: { patch: { small: null, large: null } },
    details: "beta details",
  },
  {
    id: "3",
    name: "Gamma Mission",
    date_utc: "2022-07-07T00:00:00.000Z",
    rocket: "r3",
    success: true,
    links: { patch: { small: null, large: null } },
    details: "gamma details",
  },
];

beforeEach(() => {
  (global as unknown as { fetch: jest.Mock }).fetch = jest.fn(
    (_url: string, options?: RequestInit) => {
      const body = options?.body ? JSON.parse(options.body.toString()) : {};
      const nameRegex: string | undefined = body.query?.name?.$regex;

      const docs = mockLaunches.filter((l) =>
        nameRegex
          ? l.name.toLowerCase().includes(nameRegex.toLowerCase())
          : true
      );

      return Promise.resolve({
        ok: true,
        json: async () => docs,
      });
    }
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders launches and filters by search", async () => {
  render(
    <FavoritesProvider>
      <HomePage />
    </FavoritesProvider>
  );

  // Wait for initial fetch
  await waitFor(() =>
    expect(screen.getByText("Alpha Mission")).toBeInTheDocument()
  );

  // All three missions are present initially
  expect(screen.getByText("Alpha Mission")).toBeInTheDocument();
  expect(screen.getByText("Beta Mission")).toBeInTheDocument();
  expect(screen.getByText("Gamma Mission")).toBeInTheDocument();

  // Type into search input
  const input = screen.getByPlaceholderText(/search launches/i);
  await userEvent.type(input, "Beta");

  // Only Beta Mission should remain
  await waitFor(() =>
    expect(screen.queryByText("Alpha Mission")).not.toBeInTheDocument()
  );
  expect(screen.getByText("Beta Mission")).toBeInTheDocument();
});
