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

  // 불필요한 useCallback 제거
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

  const handleToggle = () => {
    onToggle(todo);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const isTitleLong = todo.title.length > 100;

  // 간단한 클래스 계산은 useMemo 없이 직접 작성
  const containerClass = `group flex flex-col gap-3 rounded-lg border ${
    todo.completed
      ? "bg-green-100 border-green-300"
      : "bg-blue-50 border-blue-200"
  } p-4 shadow-sm h-full transition-all`;

  const checkboxClass = `mt-1 h-5 w-5 shrink-0 rounded border-2 ${
    todo.completed
      ? "border-green-600 bg-green-50"
      : "border-blue-600 bg-blue-50"
  }`;

  const titleClass = `break-words text-sm ${
    todo.completed
      ? "text-gray-700 line-through" // 색상 대비 개선
      : "text-gray-800 font-medium"
  }`;

  // 날짜 포맷팅은 필요할 때만 수행
  const formattedDate = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString()
    : "";

  return (
    <li className={containerClass}>
      <div className="flex items-start gap-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
          className={checkboxClass}
          aria-label={`${todo.completed ? "완료됨" : "미완료"}: ${todo.title}`}
        />

        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={handleTitleChange}
            autoFocus
            disabled={isUpdating}
            onKeyDown={(e) => e.key === "Enter" && handleEdit()}
            className="flex-1 py-1"
            aria-label="할 일 제목 편집"
          />
        ) : (
          <div className="flex-1 min-w-0">
            <p
              className={titleClass}
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
                className="text-xs text-blue-700 hover:text-blue-900 mt-1 font-medium"
                aria-label={isExpanded ? "내용 접기" : "내용 더 보기"}
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
              aria-label="할 일 수정 저장"
            >
              저장
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCancel}
              disabled={isUpdating}
              className="h-8 px-3 text-xs"
              aria-label="할 일 수정 취소"
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
              className="h-8 px-3 text-xs bg-blue-500 text-white hover:bg-blue-600"
              aria-label={`'${todo.title}' 할 일 수정`}
            >
              수정
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isUpdating || isDeleting}
              className="h-8 px-3 text-xs"
              aria-label={`'${todo.title}' 할 일 삭제`}
            >
              삭제
            </Button>
          </>
        )}
      </div>

      {todo.createdAt && (
        <div className="text-xs text-gray-700 mt-1">{formattedDate}</div>
      )}
    </li>
  );
}
