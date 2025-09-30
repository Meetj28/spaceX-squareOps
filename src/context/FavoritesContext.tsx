"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type FavoritesContextType = {
  favorites: string[]; // array of launch IDs
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  showOnlyFavorites: boolean;
  toggleShowOnlyFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleShowOnlyFavorites = () =>
    setShowOnlyFavorites((prev) => !prev);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, showOnlyFavorites, toggleShowOnlyFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
