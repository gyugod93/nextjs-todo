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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("할 일을 입력해주세요");
      return;
    }

    onSubmit(title.trim());
    setTitle("");
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex w-full flex-col gap-2 md:flex-row"
    >
      <Input
        placeholder="할 일을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        className="flex-1"
      />
      <Button
        type="submit"
        variant="default"
        disabled={isLoading}
        className="md:w-auto"
      >
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        추가
      </Button>
    </form>
  );
}
