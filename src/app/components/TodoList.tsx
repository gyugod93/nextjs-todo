"use client";

import { useTodos } from "../hooks/useTodos";
import TodoFilter from "./TodoFilter";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";

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

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmed) {
      removeTodo(id);
    }
  };

  if (isError) {
    return (
      <div className="rounded-md bg-red-100 p-4 text-red-600">
        투두를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="mb-6 text-3xl text-center font-bold">Todo List</h1>

      <TodoForm onSubmit={addTodo} isLoading={isCreating} />

      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />

      {isLoading ? (
        <div className="py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-gray-500">로딩 중...</span>
        </div>
      ) : todos.length > 0 ? (
        <ul>
          {todos
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((todo) => (
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
        <div className="rounded-md bg-gray-200 p-10 text-gray-600">
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
