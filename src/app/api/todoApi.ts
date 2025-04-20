import { Todo, TodoInput } from "../types/todo";

export const fetchTodos = async (): Promise<Todo[]> => {
  const url = "/api/todos"; // 항상 전체 데이터를 가져옴
  console.log("Fetching todos from:", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
};
// export const fetchTodos = async (): Promise<Todo[]> => {
//   const response = await fetch("/api/todos");
//   if (!response.ok) {
//     throw new Error("Failed to fetch todos");
//   }
//   return response.json();
// };

// export const fetchFilteredTodos = async (
//   filter: TodoFilter
// ): Promise<Todo[]> => {
//   let url = "/api/todos";

//   if (filter === "active") {
//     url += "?completed=false";
//   } else if (filter === "completed") {
//     url += "?completed=true";
//   }

//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch ${filter} todos`);
//   }
//   return response.json();
// };

export const createTodo = async (todoInput: TodoInput): Promise<Todo> => {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoInput),
  });

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
