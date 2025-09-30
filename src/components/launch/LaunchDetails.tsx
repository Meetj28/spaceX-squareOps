"use client";

import Button from "../ui/Button";
import LaunchStatusBadge from "./LaunchStatusBadge";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

type LaunchDetailsProps = {
  id: string;
  name: string;
  date: string;
  rocket: string;
  success: boolean | null;
  patch?: string;
  details?: string;
  wikipedia?: string;
  webcast?: string;
  onClose: () => void;
};

// 🔹 static text object
const staticText = {
  closeButton: "✖",
  rocketPrefix: "🚀",
  wikipedia: "Wikipedia",
  webcast: "Webcast",
};

export default function LaunchDetails({
  name,
  date,
  rocket,
  success,
  patch,
  details,
  wikipedia,
  webcast,
  onClose,
}: LaunchDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="max-w-lg w-full rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <Button variant="secondary" onClick={onClose} className="mb-4">
          {staticText.closeButton}
        </Button>

        {patch && (
          <Image
            src={patch}
            alt={`${name} patch`}
            width={32}
            height={32}
            className="mx-auto mb-4 h-32 w-32 object-contain"
          />
        )}

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          {staticText.rocketPrefix} {rocket}
        </p>
        <div className="mt-2">
          <LaunchStatusBadge success={success} />
        </div>

        {details && (
          <p className="mt-4 text-gray-700 dark:text-gray-300">{details}</p>
        )}

        <div className="mt-4 flex gap-4">
          {wikipedia && (
            <a
              href={wikipedia}
              target="_blank"
              className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
            >
              <ExternalLink size={16} className="mr-1" /> {staticText.wikipedia}
            </a>
          )}
          {webcast && (
            <a
              href={webcast}
              target="_blank"
              className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
            >
              <ExternalLink size={16} className="mr-1" /> {staticText.webcast}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
