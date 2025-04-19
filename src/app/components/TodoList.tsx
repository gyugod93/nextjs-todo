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

  if (isError) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        투두를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <h1 className="mb-6 text-center text-3xl font-bold">투두 리스트</h1>

      <TodoForm onSubmit={addTodo} isLoading={isCreating} />

      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      ) : todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={removeTodo}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          ))}
        </ul>
      ) : (
        <div className="rounded-md bg-muted/50 p-10 text-center text-muted-foreground">
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
