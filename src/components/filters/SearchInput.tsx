"use client";

type SearchInputProps = {
  value: string;
  onChange: (val: string) => void;
};

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search launches..."
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:ring focus:ring-brand/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
    />
  );
}
