"use client";

import { useState, useEffect, useMemo } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import LaunchList from "@/components/launch/LaunchList";
import SearchInput from "@/components/filters/SearchInput";
import YearFilter from "@/components/filters/YearFilter";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import ErrorState from "@/components/ui/ErrorState";

type ApiLaunch = {
  id: string;
  name: string;
  date_utc: string;
  rocket: string;
  success: boolean;
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    wikipedia?: string | null;
    webcast?: string | null;
  };
  details?: string | null;
};

// Centralized static text
const staticText = {
  filters: {
    searchPlaceholder: "Search launches...",
    yearLabel: "Year",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
    page: (page: number, total: number) => `Page ${page} of ${total || 1}`,
  },
  emptyState: {
    title: "No launches found",
    description: "Try adjusting your filters or search term.",
  },
  errorState: {
    message: "Failed to load launches. Please try again.",
  },
  label: {
    successLaunch: "Show only successful launches",
    favoritesOnly: "Favourites only",
  },
};

export default function HomePage() {
  const [launches, setLaunches] = useState<ApiLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // error state
  const [selectedLaunchId, setSelectedLaunchId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [onlySuccess, setOnlySuccess] = useState(false);

  // ⭐ favorites
  const { favorites, showOnlyFavorites, toggleShowOnlyFavorites } =
    useFavorites();

  // 📌 pagination
  const [page, setPage] = useState(1);
  const pageSize = 12;

  async function fetchLaunches() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://api.spacexdata.com/v4/launches");

      if (!res.ok) {
        throw new Error("Network error");
      }

      const data: ApiLaunch[] = await res.json();
      setLaunches(data);
    } catch (err) {
      setError(staticText.errorState.message); // set error message
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLaunches();
  }, []);

  const years = Array.from(
    new Set(launches.map((l) => l.date_utc.slice(0, 4)))
  ).sort((a, b) => Number(b) - Number(a));

  const filteredLaunches = useMemo(() => {
    return launches.filter((launch) => {
      const matchesSearch = launch.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesYear = year ? launch.date_utc.startsWith(year) : true;
      const matchesSuccess = onlySuccess ? launch.success : true;
      const matchesFavorites = showOnlyFavorites
        ? favorites.includes(launch.id)
        : true;

      return matchesSearch && matchesYear && matchesSuccess && matchesFavorites;
    });
  }, [launches, search, year, onlySuccess, showOnlyFavorites, favorites]);

  //  pagination logic
  const totalPages = Math.ceil(filteredLaunches.length / pageSize);
  const paginatedLaunches = filteredLaunches.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <div className="flex-1 min-w-[150px]">
          <YearFilter value={year} onChange={setYear} years={years} />
        </div>
        <Toggle
          checked={onlySuccess}
          onChange={setOnlySuccess}
          label={staticText.label.successLaunch}
        />
        <Toggle
          checked={showOnlyFavorites}
          onChange={toggleShowOnlyFavorites}
          label={staticText.label.favoritesOnly}
        />
      </div>

      {/* Launch list with error + loading handling */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={fetchLaunches}
          icon="⚠️"
        />
      ) : paginatedLaunches.length > 0 ? (
        <>
          <LaunchList
            launches={paginatedLaunches.map((l) => ({
              id: l.id,
              name: l.name,
              date: formatDate(l.date_utc),
              rocket: l.rocket,
              success: l.success,
              patch: l.links.patch.small || undefined,
              details: l.details || "",
              wikipedia: l.links.wikipedia || "",
              webcast: l.links.webcast || "",
            }))}
            onLaunchClick={setSelectedLaunchId}
          />

          {/* Pagination controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              {staticText.pagination.prev}
            </Button>

            <span className="text-gray-700 dark:text-gray-300">
              {staticText.pagination.page(page, totalPages)}
            </span>

            <Button
              variant="secondary"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              {staticText.pagination.next}
            </Button>
          </div>
        </>
      ) : (
        <EmptyState
          title={staticText.emptyState.title}
          description={staticText.emptyState.description}
        />
      )}
    </div>
  );
}
