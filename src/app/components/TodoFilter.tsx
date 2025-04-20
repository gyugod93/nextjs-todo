"use client";

import { Button } from "@/components/ui/button";
import { TodoFilter as FilterType } from "../types/todo";

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function TodoFilter({
  currentFilter,
  onFilterChange,
}: TodoFilterProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "active", label: "진행 중" },
    { value: "completed", label: "완료" },
  ];

  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          onClick={() => onFilterChange(value)}
          variant={currentFilter === value ? "default" : "secondary"}
          size="sm"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
