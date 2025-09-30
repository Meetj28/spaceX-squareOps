"use client";

import { useFavorites } from "@/context/FavoritesContext";
import LaunchStatusBadge from "./LaunchStatusBadge";
import Link from "next/link";
import Image from "next/image";

type LaunchCardProps = {
  id: string;
  name: string;
  date: string;
  success: boolean;
  patch?: string;
  onClick: () => void;
};

// Centralized static text
const staticText = {
  noPatch: "No Patch",
  viewDetails: "View Details",
  favorite: {
    active: "⭐",
    inactive: "☆",
  },
};

export default function LaunchCard({
  id,
  name,
  date,
  success,
  patch,
  onClick,
}: LaunchCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div
      onClick={onClick}
      className="flex flex-col rounded-lg border shadow-sm hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Card content */}
      <div className="flex flex-1 items-center p-4">
        {patch ? (
          <Image
            src={patch}
            alt={name}
            width={32}
            height={32}
            className="mr-4 h-16 w-16 rounded object-contain"
          />
        ) : (
          <div className="mr-4 flex h-16 w-16 items-center justify-center rounded border text-sm text-gray-400 dark:text-gray-500">
            {staticText.noPatch}
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{name}</h3>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
            <div className="ml-2">
              <LaunchStatusBadge success={success} />
            </div>
          </div>
        </div>

        {/* Favorite toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(id);
          }}
          className="ml-4 text-xl"
        >
          {isFavorite(id)
            ? staticText.favorite.active
            : staticText.favorite.inactive}
        </button>
      </div>

      {/* View Details button at bottom */}
      <Link
        href={`/launches/${id}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-b-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
      >
        {staticText.viewDetails}
      </Link>
    </div>
  );
}
