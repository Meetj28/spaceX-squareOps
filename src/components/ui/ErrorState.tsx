"use client";

import { ReactNode } from "react";
import Button from "./Button";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
  icon?: ReactNode;
};

export default function ErrorState({ message, onRetry, icon }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-red-600 dark:text-red-400">
      {icon && <div className="mb-2 text-3xl">{icon}</div>}
      <p className="mb-4">{message}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
