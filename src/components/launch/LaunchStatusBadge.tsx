"use client";

type LaunchStatusBadgeProps = {
  success: boolean | null;
};

const staticText = {
  success: "Success",
  failure: "Failure",
  upcoming: "Upcoming",
};

export default function LaunchStatusBadge({ success }: LaunchStatusBadgeProps) {
  if (success === true) {
    return (
      <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
        {staticText.success}
      </span>
    );
  }

  if (success === false) {
    return (
      <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
        {staticText.failure}
      </span>
    );
  }

  return (
    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
      {staticText.upcoming}
    </span>
  );
}
