import { v4 as uuidv4 } from "uuid";
import { Todo, TodoFilter, TodoInput } from "../types/todo";

const API_URL = "http://localhost:3001";

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
};

export const fetchFilteredTodos = async (
  filter: TodoFilter
): Promise<Todo[]> => {
  let url = `${API_URL}/todos`;

  if (filter === "active") {
    url += "?completed=false";
  } else if (filter === "completed") {
    url += "?completed=true";
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filter} todos`);
  }
  return response.json();
};

export const createTodo = async (todoInput: TodoInput): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...todoInput,
      id: uuidv4(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create todo");
  }
  return response.json();
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todos/${todo.id}`, {
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
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete todo ${id}`);
  }
};
