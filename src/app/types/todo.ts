export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type TodoFilter = "all" | "active" | "completed";

export type TodoInput = Omit<Todo, "id">;
