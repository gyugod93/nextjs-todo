"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEdit = () => {
    if (editedTitle.trim() && editedTitle !== todo.title) {
      onEdit(todo.id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <li
      className={`group mb-3 flex items-center justify-between rounded-lg border ${
        todo.completed
          ? "bg-green-200 border-green-400"
          : "bg-blue-100 border-blue-300"
      } p-4 shadow-sm transition-all`}
    >
      <div className="flex flex-1 items-center">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo)}
          disabled={isUpdating}
          className={`mr-3 h-5 w-5 rounded border-2 ${
            todo.completed
              ? "border-green-600 bg-green-100"
              : "border-blue-600 bg-blue-50"
          }`}
        />

        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            autoFocus
            disabled={isUpdating}
            onKeyDown={(e) => e.key === "Enter" && handleEdit()}
            className="py-1"
          />
        ) : (
          <span
            className={`flex-1 ${
              todo.completed
                ? "text-gray-600 line-through"
                : "text-gray-900 font-semibold"
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="ml-4 flex items-center gap-2">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={handleEdit}
              disabled={
                !editedTitle.trim() || editedTitle === todo.title || isUpdating
              }
            >
              {isUpdating && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              저장
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              취소
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsEditing(true)}
              disabled={isUpdating || isDeleting}
            >
              수정
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(todo.id)}
              disabled={isUpdating || isDeleting}
            >
              {isDeleting && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              삭제
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
