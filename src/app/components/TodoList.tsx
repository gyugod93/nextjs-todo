"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { useTodos } from "../hooks/useTodos";
import TodoItem from "./TodoItem";

const TodoFilter = dynamic(() => import("./TodoFilter"), {
  ssr: false, // 클라이언트에서만 필요한 경우
  loading: () => (
    <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
  ),
});

const TodoForm = dynamic(() => import("./TodoForm"), {
  ssr: true, // 초기 렌더링에 중요한 경우
});

export default function TodoList() {
  const {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    isLoading,
    isError,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTodos();

  const handleDelete = useCallback(
    (id: string) => {
      const confirmed = window.confirm("정말로 삭제하시겠습니까?");
      if (confirmed) {
        removeTodo(id);
      }
    },
    [removeTodo]
  );

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      return a.createdAt > b.createdAt ? -1 : 1;
    });
  }, [todos]);

  if (isError) {
    return (
      <div className="rounded-md bg-red-100 p-4 text-red-600">
        투두를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
      <h1 className="mb-8 text-4xl text-center font-bold text-gray-800">
        Todo List
      </h1>

      <TodoForm onSubmit={addTodo} isLoading={isCreating} />

      <div className="mt-8 mb-6">
        <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="mt-4 text-gray-500">로딩 중...</span>
        </div>
      ) : todos.length > 0 ? (
        <ul className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={() => handleDelete(todo.id)}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          ))}
        </ul>
      ) : (
        <div className="rounded-md bg-gray-200 p-10 text-center text-gray-600 my-8">
          {filter === "all"
            ? "등록된 할 일이 없습니다."
            : filter === "active"
            ? "진행 중인 할 일이 없습니다."
            : "완료된 할 일이 없습니다."}
        </div>
      )}
    </div>
  );
}
