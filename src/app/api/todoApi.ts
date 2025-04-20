import { Todo, TodoInput } from "../types/todo";

export const fetchTodos = async (): Promise<Todo[]> => {
  const url = "/api/todos";
  console.log("fetchTodos 호출됨");
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  const data = await response.json();
  console.log("fetchTodos 반환 데이터:", data); // 반환 데이터 확인
  return data;
};

export const createTodo = async (todoInput: TodoInput): Promise<Todo> => {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoInput),
  });
  console.log("Creating todo:", todoInput);
  if (!response.ok) {
    throw new Error("Failed to create todo");
  }
  return response.json();
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch(`/api/todos`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error(`Failed to update todo ${todo.id}`);
  }
  return response.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`/api/todos?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete todo ${id}`);
  }
};
