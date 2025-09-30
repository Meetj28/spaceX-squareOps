"use client";

type YearFilterProps = {
  value: string;
  onChange: (val: string) => void;
  years: string[];
};

export default function YearFilter({ value, onChange, years }: YearFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:ring focus:ring-brand/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
    >
      <option value="">All Years</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
}
