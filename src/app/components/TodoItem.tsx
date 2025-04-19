"use client";

import { Button } from "@/components/ui/button";
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
      onEdit(todo.id, editedTitle.trim()); // 수정 요청
    }
    setIsEditing(false); // 수정 모드 종료
  };

  const handleCancel = () => {
    setEditedTitle(todo.title); // 원래 제목으로 복원
    setIsEditing(false); // 수정 모드 종료
  };

  return (
    <li
      className={`group mb-3 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all ${
        todo.completed ? "bg-gray-50" : ""
      }`}
    >
      <div className="flex flex-1 items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          disabled={isUpdating}
          className="mr-3 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
            className={`flex-1 text-gray-700 ${
              todo.completed ? "text-gray-400 line-through" : ""
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
