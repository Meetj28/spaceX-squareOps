import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoritesProvider, useFavorites } from "@/context/FavoritesContext";

function TestConsumer() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  return (
    <div>
      <div data-testid="count">{favorites.length}</div>
      <button onClick={() => toggleFavorite("abc")}>Toggle-abc</button>
      <div data-testid="isfav">{isFavorite("abc") ? "yes" : "no"}</div>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test("toggleFavorite updates state and persists to localStorage", async () => {
  render(
    <FavoritesProvider>
      <TestConsumer />
    </FavoritesProvider>
  );

  const button = screen.getByText("Toggle-abc");
  expect(screen.getByTestId("count").textContent).toBe("0");
  expect(screen.getByTestId("isfav").textContent).toBe("no");

  await userEvent.click(button); // add
  expect(screen.getByTestId("count").textContent).toBe("1");
  expect(screen.getByTestId("isfav").textContent).toBe("yes");

  // localStorage should contain the id
  const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
  expect(Array.isArray(stored)).toBe(true);
  expect(stored).toContain("abc");

  await userEvent.click(button); // remove
  expect(screen.getByTestId("count").textContent).toBe("0");
  const storedAfter = JSON.parse(localStorage.getItem("favorites") || "[]");
  expect(storedAfter).not.toContain("abc");
});
