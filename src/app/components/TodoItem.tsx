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
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleDelete = () => {
    onDelete(todo.id);
  };

  // 글자 수에 따라 축소 표시 여부 결정
  const isTitleLong = todo.title.length > 100;

  return (
    <li
      className={`group flex flex-col gap-3 rounded-lg border ${
        todo.completed
          ? "bg-green-100 border-green-300"
          : "bg-blue-50 border-blue-200"
      } p-4 shadow-sm h-full transition-all`}
    >
      <div className="flex items-start gap-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo)}
          disabled={isUpdating}
          className={`mt-1 h-5 w-5 shrink-0 rounded border-2 ${
            todo.completed
              ? "border-green-600 bg-green-50"
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
            className="flex-1 py-1"
          />
        ) : (
          <div className="flex-1 min-w-0">
            <p
              className={`break-words text-sm ${
                todo.completed
                  ? "text-gray-500 line-through"
                  : "text-gray-800 font-medium"
              }`}
              style={{
                wordBreak: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: isExpanded ? "block" : "-webkit-box",
                WebkitLineClamp: isExpanded ? "none" : 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {todo.title}
            </p>

            {isTitleLong && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
              >
                {isExpanded ? "접기" : "더 보기..."}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-row items-center gap-2 justify-end">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={handleEdit}
              disabled={
                !editedTitle.trim() || editedTitle === todo.title || isUpdating
              }
              className="h-8 px-3 text-xs"
            >
              저장
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCancel}
              disabled={isUpdating}
              className="h-8 px-3 text-xs"
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
              className="h-8 px-3 text-xs"
            >
              수정
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isUpdating || isDeleting}
              className="h-8 px-3 text-xs"
            >
              삭제
            </Button>
          </>
        )}
      </div>

      {todo.createdAt && (
        <div className="text-xs text-gray-500 mt-1">
          {new Date(todo.createdAt).toLocaleDateString()}
        </div>
      )}
    </li>
  );
}
