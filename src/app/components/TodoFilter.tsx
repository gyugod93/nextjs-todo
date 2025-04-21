"use client";

import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { TodoFilter as FilterType } from "../types/todo";

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

export default function TodoFilter({
  currentFilter,
  onFilterChange,
}: TodoFilterProps) {
  const handleFilterChange = useCallback(
    (filter: FilterType) => {
      onFilterChange(filter);
    },
    [onFilterChange]
  );

  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
      {FILTERS.map(({ value, label }) => (
        <Button
          key={value}
          onClick={() => handleFilterChange(value)}
          variant={currentFilter === value ? "default" : "secondary"}
          size="sm"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
