"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useCallback, useMemo, useState } from "react";
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

  const handleEdit = useCallback(() => {
    if (editedTitle.trim() && editedTitle !== todo.title) {
      onEdit(todo.id, editedTitle.trim());
    }
    setIsEditing(false);
  }, [editedTitle, todo.id, todo.title, onEdit]);

  const handleCancel = useCallback(() => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  }, [todo.title]);

  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [onDelete, todo.id]);

  const handleToggle = useCallback(() => {
    onToggle(todo);
  }, [onToggle, todo]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedTitle(e.target.value);
    },
    []
  );

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const isTitleLong = useMemo(() => todo.title.length > 100, [todo.title]);

  const containerStyle = useMemo(() => {
    return `group flex flex-col gap-3 rounded-lg border ${
      todo.completed
        ? "bg-green-100 border-green-300"
        : "bg-blue-50 border-blue-200"
    } p-4 shadow-sm h-full transition-all`;
  }, [todo.completed]);

  const checkboxStyle = useMemo(() => {
    return `mt-1 h-5 w-5 shrink-0 rounded border-2 ${
      todo.completed
        ? "border-green-600 bg-green-50"
        : "border-blue-600 bg-blue-50"
    }`;
  }, [todo.completed]);

  const titleStyle = useMemo(() => {
    return `break-words text-sm ${
      todo.completed
        ? "text-gray-500 line-through"
        : "text-gray-800 font-medium"
    }`;
  }, [todo.completed]);

  const formattedDate = useMemo(() => {
    return todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : "";
  }, [todo.createdAt]);

  return (
    <li className={containerStyle}>
      <div className="flex items-start gap-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
          className={checkboxStyle}
        />

        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={handleTitleChange}
            autoFocus
            disabled={isUpdating}
            onKeyDown={(e) => e.key === "Enter" && handleEdit()}
            className="flex-1 py-1"
          />
        ) : (
          <div className="flex-1 min-w-0">
            <p
              className={titleStyle}
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
                onClick={toggleExpand}
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
        <div className="text-xs text-gray-500 mt-1">{formattedDate}</div>
      )}
    </li>
  );
}
