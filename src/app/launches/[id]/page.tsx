import { notFound } from "next/navigation";
import Image from "next/image";
import LaunchStatusBadge from "@/components/launch/LaunchStatusBadge";
import ErrorState from "@/components/ui/ErrorState"; // ✅ import

type Launch = {
  id: string;
  name: string;
  flight_number: number;
  date_utc: string;
  details: string | null;
  success: boolean | null;
  failures: { time: number; altitude: number | null; reason: string }[];
  links: {
    patch: { large: string | null; small: string | null };
    wikipedia: string | null;
    webcast: string | null;
    article: string | null;
  };
};

// 📌 Static text
const staticText = {
  missionDetails: "Mission Details",
  failures: "Failure Cause",
  date: "Date",
  flight: "Flight #",
  noDetails: "No mission details available.",
  error: "Failed to load launch details. Please try again.",
  external: {
    wikipedia: "Wikipedia",
    webcast: "Webcast",
    article: "Article",
  },
};

export default async function LaunchDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  let launch: Launch | null = null;

  try {
    const res = await fetch(
      `https://api.spacexdata.com/v4/launches/${params.id}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (res.status === 404) return notFound();
    if (!res.ok) throw new Error("API error");

    launch = await res.json();
  } catch (err) {
    return (
      <ErrorState
        message={staticText.error}
        icon="⚠️"
        onRetry={() => {
          // Refresh page to retry server-side fetch
          if (typeof window !== "undefined") window.location.reload();
        }}
      />
    );
  }

  if (!launch) return notFound();

  return (
    <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3">
      {/* Left Section */}
      <div className="col-span-1 mb-8 md:mb-0 md:pr-8">
        <div className="rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 p-6 shadow-sm flex flex-col items-center text-center">
          {launch.links.patch.large && (
            <Image
              src={launch.links.patch.large}
              alt={launch.name}
              width={64}
              height={64}
              className="mb-4 h-40 w-40 object-contain"
            />
          )}
          <h1 className="text-2xl font-bold">{launch.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {staticText.flight} {launch.flight_number}
          </p>
          <div className="mt-3">
            <LaunchStatusBadge success={launch.success} />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="col-span-2 flex flex-col space-y-6">
        {/* Mission Details */}
        <div className="rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {staticText.missionDetails}
          </h2>
          <p className="mb-2 text-gray-600 dark:text-gray-400">
            <strong>{staticText.date}:</strong>{" "}
            {new Date(launch.date_utc).toLocaleString(undefined, {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
          <p>{launch.details || staticText.noDetails}</p>
        </div>

        {/* Failures */}
        {launch.failures?.length > 0 && (
          <div className="rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              {staticText.failures}
            </h2>
            <ul className="list-disc list-inside space-y-2">
              {launch.failures.map((f, idx) => (
                <li key={idx}>
                  At <strong>{f.time}s</strong> – {f.reason}{" "}
                  {f.altitude && `(altitude: ${f.altitude}m)`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* External Links */}
        <div className="flex flex-wrap gap-4">
          {launch.links.wikipedia && (
            <a
              href={launch.links.wikipedia}
              target="_blank"
              className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >
              {staticText.external.wikipedia}
            </a>
          )}
          {launch.links.webcast && (
            <a
              href={launch.links.webcast}
              target="_blank"
              className="rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700"
            >
              {staticText.external.webcast}
            </a>
          )}
          {launch.links.article && (
            <a
              href={launch.links.article}
              target="_blank"
              className="rounded-lg bg-gray-600 text-white px-4 py-2 hover:bg-gray-700"
            >
              {staticText.external.article}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
