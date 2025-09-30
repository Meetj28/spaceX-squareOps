import LaunchCard from "./LaunchCard";
import EmptyState from "@/components/ui/EmptyState";

type Launch = {
  id: string;
  name: string;
  date: string;
  rocket: string;
  success: boolean;
  patch?: string;
  details?: string;
  wikipedia?: string;
  webcast?: string;
};

type LaunchListProps = {
  launches: Launch[];
  onLaunchClick: (id: string) => void;
};

// 🔹 static text object
const staticText = {
  emptyStateTitle: "No launches found.",
  emptyStateIcon: "🚀",
};

export default function LaunchList({ launches, onLaunchClick }: LaunchListProps) {
  if (launches.length === 0) {
    return (
      <EmptyState
        title={staticText.emptyStateTitle}
        icon={staticText.emptyStateIcon}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {launches.map((launch) => (
        <LaunchCard
          key={launch.id}
          {...launch}
          onClick={() => onLaunchClick(launch.id)}
        />
      ))}
    </div>
  );
}
