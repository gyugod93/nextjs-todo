import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "../api/todoApi";
import { Todo, TodoFilter, TodoInput } from "../types/todo";

export function useTodos() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TodoFilter>("all");

  const {
    data: allTodos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 5 * 60 * 1000,
  });

  const todos = allTodos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

const createTodoMutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => {
    console.log("invalidateQueries 호출됨");
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
  onError: (error) => {
    console.error("투두 추가 실패:", error);
  },
});

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onMutate: async (updatedTodo: Todo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      if (previousTodos) {
        queryClient.setQueryData(
          ["todos"],
          previousTodos.map((todo) =>
            todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
          )
        );
      }

      return { previousTodos };
    },
    onError: (err, updatedTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const addTodo = (title: string) => {
    const newTodo: TodoInput = {
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    createTodoMutation.mutate(newTodo);
  };

  const toggleTodo = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    updateTodoMutation.mutate(updatedTodo);
  };

  const editTodo = (id: string, title: string) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (todoToUpdate) {
      const updatedTodo = { ...todoToUpdate, title };
      updateTodoMutation.mutate(updatedTodo);
    }
  };

  const removeTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  return {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    isLoading,
    isError,
    error,
    isCreating: createTodoMutation.isPending,
    isUpdating: updateTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
  };
}
