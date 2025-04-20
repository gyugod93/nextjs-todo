"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TodoFormProps {
  onSubmit: (title: string) => void;
  isLoading?: boolean;
}

export default function TodoForm({
  onSubmit,
  isLoading = false,
}: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setShowError(true);
      return;
    }
    onSubmit(title.trim());
    setTitle("");
    setShowError(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <Input
          placeholder="할 일을 입력하세요"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setShowError(false);
          }}
          disabled={isLoading}
          className="w-full"
        />
        {showError && (
          <p className="mt-1 text-sm text-red-500">할 일을 입력해주세요</p>
        )}
      </div>
      <Button
        type="submit"
        variant="default"
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        추가
      </Button>
    </form>
  );
}
