import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </main>
  );
}
